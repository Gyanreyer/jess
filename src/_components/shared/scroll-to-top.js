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
          this.classList.remove("visible");
        } else {
          // If the nav is not visible, show the scroll-to-top button
          this.classList.add("visible");
        }
      });

      const navElement = document.getElementsByTagName("nav")[0];
      this.navObserver.observe(navElement);

      const link = this.getElementsByTagName("a")[0];
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
