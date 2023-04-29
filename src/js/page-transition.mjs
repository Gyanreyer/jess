{
  const anchorElements = document.querySelectorAll('a[href^="/"]');
  const pageTransitionAttr = "data-pg-trns";

  const onClick = async (e) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Don't play the page transition animation if the user prefers reduced motion
      return;
    }

    const targetURL = new URL(e.currentTarget.href);
    if (targetURL.pathname === window.location.pathname) {
      // Don't do anything if the link is to the same page
      return;
    }

    // Prevent the browser from navigating to the page as an MPA;
    // time to do some of our own magic!
    e.preventDefault();

    const newPageHTMLPromise = fetch(targetURL.href).then((res) => res.text());

    const pageTransitionElement = document.getElementById("pg-trns");

    pageTransitionElement.addEventListener("transitionstart", () => {});

    document.body.setAttribute(pageTransitionAttr, "start");

    pageTransitionElement.addEventListener(
      "transitionend",
      async () => {
        const template = document.createElement("template");
        const newHTML = await newPageHTMLPromise;

        const headContents = newHTML.split(/<head[^>]*>|<\/head>/g)[1];
        const bodyContents = newHTML.split(/<body[^>]*>|<\/body>/g)[1];

        template.innerHTML = headContents;

        document.head
          .querySelectorAll("meta,title")
          .forEach((el) => el.remove());

        for (const newHeadChild of template.content.childNodes) {
          document.head.appendChild(newHeadChild.cloneNode(true));
        }

        template.innerHTML = bodyContents;

        for (const bodyChild of document.body.children) {
          if (bodyChild === pageTransitionElement) {
            continue;
          }
          bodyChild.remove();
        }

        for (const newChild of template.content.childNodes) {
          if (newChild.id === "pg-trns") {
            continue;
          }
          document.body.appendChild(newChild.cloneNode(true));
        }

        pageTransitionElement.addEventListener(
          "transitionend",
          () => {
            document.body.removeAttribute(pageTransitionAttr);
          },
          { once: true }
        );
        document.body.setAttribute(pageTransitionAttr, "end");
      },
      { once: true }
    );
  };
  for (const el of anchorElements) {
    el.addEventListener("click", onClick);
  }
}
