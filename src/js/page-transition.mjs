{
  if (history.scrollRestoration) {
    history.scrollRestoration = "manual";
  }

  let previousURL = new URL(window.location.href);
  const previousScrollPositions = {};

  const updatePreviousURL = (newURL) => {
    previousScrollPositions[previousURL.pathname] = window.scrollY;
    previousURL = newURL;
  };

  const pageTransitionStateAttr = "data-pg-trns-state";
  const pageTransitionIDAttr = "data-pg-trns-id";

  const pageCache = {};

  const domParser = new DOMParser();

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

    return (pageCache[pathname] = pagePromise);
  };

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
          `[${pageTransitionIDAttr}="${pageTransitionID}"]`
        );
        if (existingPageTransitionElement) {
          continue;
        }
      }

      if (child.tagName === "SCRIPT") {
        const scriptTag = document.createElement("script");
        if (child.src) {
          scriptTag.setAttribute("src", child.src);
        } else {
          scriptTag.appendChild(document.createTextNode(child.textContent));
        }
        targetElement.appendChild(scriptTag);
      } else {
        targetElement.appendChild(child.cloneNode(true));
      }
    }
  };

  const transitionURLQueue = [];
  let isTransitioning = false;

  const transitionToPage = async (newPageURL, isBackNavigation) => {
    try {
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

      if (!isBackNavigation && newPageURL.hash) {
        document.getElementById(newPageURL.hash.substring(1)).scrollIntoView();
      } else {
        // Restore the previous scroll position for this page if available, otherwise scroll to the top
        window.scroll(0, previousScrollPositions[newPageURL.pathname] || 0);
        delete previousScrollPositions[newPageURL.pathname];
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
          transitionToPage(nextPageURL);
        });
      }
    } catch (err) {
      console.error("Error during page transition: ", err);

      const nextPageURL = transitionURLQueue.pop() || newPageURL;
      transitionURLQueue.length = 0;
      window.location.href = nextPageURL.href;
    }
  };

  const onClick = (e) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Don't play the page transition animation if the user prefers reduced motion
      return;
    }

    const targetURL = new URL(e.currentTarget.href);
    updatePreviousURL(targetURL);

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
    document.querySelectorAll('a[href^="/"]:not([download])').forEach((el) => {
      el.addEventListener("click", onClick);

      // When the current page is closed, clean up listeners
      document.addEventListener(
        "transition:pageclosed",
        function onPageClosed() {
          el.removeEventListener("click", onClick);
          document.removeEventListener("transition:pageclosed", onPageClosed);
        }
      );
    });
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

    if (newURL.pathname !== previousURL.pathname) {
      transitionToPage(newURL, true);
    }

    updatePreviousURL(newURL);
  });
}
