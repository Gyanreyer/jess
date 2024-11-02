if (!customElements.get("scroll-reveal")) {
  class ScrollReveal extends HTMLElement {
    static observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const targetElement = entry.target;
            targetElement.setAttribute("data-revealed", "true");
            observer.unobserve(targetElement);
          }
        });
      },
      { threshold: 1 }
    );

    connectedCallback() {
      ScrollReveal.observer.observe(this);
    }

    disconnectedCallback() {
      ScrollReveal.observer.unobserve(this);
    }
  }

  customElements.define("scroll-reveal", ScrollReveal);
}
