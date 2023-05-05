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

  const pageTransitionAttr = "data-pg-trns";

  const pageCache = {};

  const dataThemeRegex = /data-theme="([^"]*)"/;
  const htmlHeadStartRegex = /<head[^>]*>/;
  const htmlHeadEndRegex = /<\/head>/;
  const htmlBodyStartRegex = /<body[^>]*>/;
  const htmlBodyEndRegex = /<\/body>/;

  const fetchPage = async (pathname) => {
    if (pageCache[pathname]) {
      return pageCache[pathname].promise || pageCache[pathname];
    }

    const pagePromise = fetch(pathname)
      .then((res) => res.text())
      .then((rawFullPageHTML) => {
        const dataTheme = rawFullPageHTML.match(dataThemeRegex)[1];

        const headStartMatch = rawFullPageHTML.match(htmlHeadStartRegex);
        const headEndMatch = rawFullPageHTML.match(htmlHeadEndRegex);

        const bodyStartMatch = rawFullPageHTML.match(htmlBodyStartRegex);
        const bodyEndMatch = rawFullPageHTML.match(htmlBodyEndRegex);

        const headTagContents = rawFullPageHTML.slice(
          headStartMatch.index + headStartMatch[0].length,
          headEndMatch.index
        );
        const bodyTagContents = rawFullPageHTML.slice(
          bodyStartMatch.index + bodyStartMatch[0].length,
          bodyEndMatch.index
        );

        return (pageCache[pathname] = {
          dataTheme,
          head: headTagContents,
          body: bodyTagContents,
        });
      });

    pageCache[pathname] = {
      promise: pagePromise,
    };

    return pagePromise;
  };

  const transitionURLQueue = [];
  let isTransitioning = false;

  const transitionToPage = async (newPageURL) => {
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

      const pageTransitionElement = document.getElementById("pg-trns");

      document.documentElement.setAttribute(pageTransitionAttr, "start");

      await new Promise((resolve) => setTimeout(resolve, 600));

      document.dispatchEvent(new CustomEvent("transition:pageclosed"));

      const transitionPageURL = transitionURLQueue.pop();
      transitionURLQueue.length = 0;

      const {
        dataTheme,
        head: newHeadHTML,
        body: newBodyHTML,
      } = await fetchPage(transitionPageURL.pathname);

      document.documentElement.setAttribute("data-theme", dataTheme);

      const template = document.createElement("template");
      template.innerHTML = newHeadHTML;

      const headTemplateContent = template.content;

      document.head.replaceChildren(
        ...Array.from(headTemplateContent.childNodes).map((el) =>
          el.cloneNode(true)
        )
      );

      template.innerHTML = newBodyHTML;
      const bodyTemplateContent = template.content;

      const bodyChildren = document.body.children;

      // Remove all body children except the page transition element,
      // starting from the end to avoid messing with indices as we remove elements
      for (let i = bodyChildren.length - 1; i >= 0; --i) {
        const bodyChild = bodyChildren[i];
        if (bodyChild === pageTransitionElement) {
          continue;
        }
        bodyChild.remove();
      }

      for (const newChild of bodyTemplateContent.children) {
        if (newChild.id === "pg-trns") {
          continue;
        }

        let newNode;

        if (newChild.tagName === "SCRIPT") {
          newNode = document.createElement("script");
          if (newChild.src) {
            newNode.setAttribute("src", newChild.src);
          } else {
            newNode.appendChild(document.createTextNode(newChild.textContent));
          }
        } else {
          newNode = newChild.cloneNode(true);
        }

        document.body.appendChild(newNode);
      }

      if (newPageURL.hash) {
        document.getElementById(newPageURL.hash.substring(1)).scrollIntoView();
      } else {
        // Restore the previous scroll position for this page if available, otherwise scroll to the top
        window.scroll(0, previousScrollPositions[newPageURL.pathname] || 0);
        delete previousScrollPositions[newPageURL.pathname];
      }

      document.dispatchEvent(new CustomEvent("transition:pageopened"));

      document.documentElement.setAttribute(pageTransitionAttr, "end");

      await new Promise((resolve) => setTimeout(resolve, 600));

      document.documentElement.removeAttribute(pageTransitionAttr);

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
      transitionToPage(newURL);
    }

    updatePreviousURL(newURL);
  });
}
