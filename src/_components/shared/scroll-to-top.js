if (!customElements.get("scroll-to-top")) {
  class ScrollToTop extends HTMLElement {
    /**
     * @type {IntersectionObserver | null}
     */
    navObserver = null;

    connectedCallback() {
      this.navObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          // If the nav is visible, hide the scroll-to-top button
          delete this.dataset.visible;
        } else {
          // If the nav is not visible, show the scroll-to-top button
          this.dataset.visible = "true";
        }
      });

      const navElement = document.querySelector("nav");
      if (!navElement) {
        console.error("No nav element found in scroll-to-top");
        return;
      }
      this.navObserver.observe(navElement);

      const link = this.querySelector("a");
      if (!link) {
        console.error("No link found in scroll-to-top");
        return;
      }
      link.addEventListener("click", (event) => {
        event.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    }

    disconnectedCallback() {
      // Clean up the IntersectionObserver
      this.navObserver?.disconnect();
    }
  }

  customElements.define("scroll-to-top", ScrollToTop);
}
