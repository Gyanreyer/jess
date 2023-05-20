{
  if (history.scrollRestoration) {
    history.scrollRestoration = "manual";
  }

  /** @type {null | URL} */
  let previousURL = null;
  let currentURL = new URL(window.location.href);
  const previousScrollPositions = {};

  /**
   * @param {URL} newURL
   */
  const updatePreviousURL = (newURL) => {
    previousScrollPositions[currentURL.pathname] = window.scrollY;
    previousURL = currentURL;
    currentURL = newURL;
  };

  const pageTransitionStateAttr = "pgtrns:state";
  const pageTransitionIDAttr = "pgtrns:id";
  const pageTransitionIDSelector = "pgtrns\\:id";

  /**
   * @typedef {Object} PageCacheEntry
   * @property {string} theme
   * @property {HTMLElement[]} headChildren
   * @property {HTMLElement[]} bodyChildren
   */

  /** @type {Object.<string, Promise<PageCacheEntry> | PageCacheEntry> }} */
  const pageCache = {};

  const domParser = new DOMParser();

  /**
   * @param {string} pathname
   * @returns {Promise<PageCacheEntry>}
   */
  const fetchPage = async (pathname) => {
    if (pageCache[pathname]) {
      return pageCache[pathname];
    }

    const pagePromise = fetch(pathname)
      .then((res) => res.text())
      .then((htmlString) => {
        const parsedDocument = domParser.parseFromString(
          htmlString,
          "text/html"
        );

        return {
          theme: parsedDocument.documentElement.getAttribute("data-theme"),
          headChildren: Array.from(parsedDocument.head.children),
          bodyChildren: Array.from(parsedDocument.body.children),
        };
      });

    pagePromise.then((pageData) => {
      // Unwrap the data returned from the promise into the cache
      pageCache[pathname] = pageData;
    });

    return (pageCache[pathname] = pagePromise);
  };

  /**
   * @param {HTMLElement} targetElement
   * @param {HTMLElement[]} newChildren
   */
  const applyNewPageContents = (targetElement, newChildren) => {
    const initialChildCount = targetElement.childNodes.length;
    for (let i = initialChildCount - 1; i >= 0; i--) {
      const child = targetElement.childNodes[i];
      if (!child.hasAttribute?.(pageTransitionIDAttr)) {
        child.remove();
      }
    }

    // Append all new children to the target (except for any duplicates of the persisted contents)
    for (const child of newChildren) {
      const pageTransitionID = child.getAttribute(pageTransitionIDAttr);

      if (pageTransitionID) {
        const existingPageTransitionElement = targetElement.querySelector(
          `[${pageTransitionIDSelector}="${pageTransitionID}"]`
        );
        if (existingPageTransitionElement) {
          continue;
        }
      }

      if (child.tagName === "SCRIPT") {
        const scriptTag = document.createElement("script");
        // Transfer over all attributes to the new script tag
        for (const attr of child.attributes) {
          scriptTag.setAttribute(attr.name, attr.value);
        }
        if (child.textContent) {
          scriptTag.appendChild(document.createTextNode(child.textContent));
        }
        targetElement.appendChild(scriptTag);
      } else {
        targetElement.appendChild(child.cloneNode(true));
      }
    }
  };

  /** @type {URL[]} */
  const transitionURLQueue = [];
  let isTransitioning = false;

  /**
   * @param {URL} newPageURL
   * @param {boolean} isBackNavigation
   */
  const transitionToPage = async (
    newPageURL,
    isBackNavigation = newPageURL.pathname === previousURL?.pathname
  ) => {
    try {
      updatePreviousURL(newPageURL);

      transitionURLQueue.push(newPageURL);
      // Start fetching the new page so we can load it while the transition animation is playing
      fetchPage(newPageURL.pathname);

      if (isTransitioning) {
        // If a transition is already in progress, stop here; we have just queued up the new URL
        // so it will get transitioned to after the current transition is finished
        return;
      }

      isTransitioning = true;

      document.documentElement.setAttribute(pageTransitionStateAttr, "start");

      await new Promise((resolve) => setTimeout(resolve, 600));

      document.dispatchEvent(new CustomEvent("transition:pageclosed"));

      const transitionPageURL = transitionURLQueue.pop();
      transitionURLQueue.length = 0;

      const { theme, headChildren, bodyChildren } = await fetchPage(
        transitionPageURL.pathname
      );

      document.documentElement.setAttribute("data-theme", theme);

      applyNewPageContents(document.head, headChildren);
      applyNewPageContents(document.body, bodyChildren);

      if (isBackNavigation) {
        // Restore the previous scroll position for this page if available, otherwise scroll to the top
        window.scroll(0, previousScrollPositions[newPageURL.pathname] || 0);
        delete previousScrollPositions[newPageURL.pathname];
      } else if (newPageURL.hash) {
        document.getElementById(newPageURL.hash.substring(1)).scrollIntoView();
      } else {
        window.scroll(0, 0);
      }

      document.dispatchEvent(new CustomEvent("transition:pageopened"));

      document.documentElement.setAttribute(pageTransitionStateAttr, "end");

      await new Promise((resolve) => setTimeout(resolve, 600));

      document.documentElement.removeAttribute(pageTransitionStateAttr);

      isTransitioning = false;

      if (transitionURLQueue.length > 0) {
        requestIdleCallback(() => {
          // If more URLs got added to the queue since the second half of the transition animation started,
          // start transitioning again for the new target URL
          const nextPageURL = transitionURLQueue.pop();
          transitionURLQueue.length = 0;
          transitionToPage(nextPageURL, isBackNavigation);
        });
      }
    } catch (err) {
      console.error("Error during page transition: ", err);

      const nextPageURL = transitionURLQueue.pop() || newPageURL;
      transitionURLQueue.length = 0;
      window.location.href = nextPageURL.href;
    }
  };

  const onClickLink = (
    /** @type {MouseEvent} */
    e
  ) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Don't play the page transition animation if the user prefers reduced motion
      return;
    }

    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) {
      // Don't do a transition if the user is holding down a modifier key
      return;
    }

    const targetURL = new URL(e.currentTarget.href);

    if (targetURL.pathname === window.location.pathname) {
      if (targetURL.hash) {
        // If the link is to an anchor on the same page, smoothly scroll to it
        e.preventDefault();
        document.getElementById(targetURL.hash.substring(1)).scrollIntoView({
          behavior: "smooth",
        });
      }

      // Don't do a transition if the link is to the same page
      return;
    }

    // Prevent the browser from navigating to the page as an MPA;
    // time to do some of our own magic!
    e.preventDefault();

    window.history.pushState({}, "", targetURL);
    transitionToPage(targetURL);
  };

  const addLinkTransitionListeners = () => {
    document.querySelectorAll('a[href^="/"]').forEach(
      (
        /** @type {HTMLAnchorElement} */
        el
      ) => {
        if (el.download || el.target === "_blank") {
          return;
        }

        el.addEventListener("click", onClickLink);

        // When the current page is closed, clean up listeners
        document.addEventListener(
          "transition:pageclosed",
          function onPageClosed() {
            el.removeEventListener("click", onClickLink);
            document.removeEventListener("transition:pageclosed", onPageClosed);
          }
        );
      }
    );
  };

  addLinkTransitionListeners();

  // When a new page is opened, add listeners to all links on the new page
  document.addEventListener(
    "transition:pageopened",
    addLinkTransitionListeners
  );

  // Kick off transitions when the user navigates back via the browser's back button
  window.addEventListener("popstate", () => {
    const newURL = new URL(window.location.href);

    if (newURL.pathname !== currentURL.pathname) {
      transitionToPage(newURL, true);
    }
  });
}
