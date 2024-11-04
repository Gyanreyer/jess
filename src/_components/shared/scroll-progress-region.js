if (!customElements.get("scroll-progress-region")) {
  class ScrollProgressRegion extends HTMLElement {
    constructor() {
      super();

      this._onScroll = this._onScroll.bind(this);
    }

    connectedCallback() {
      this._onScroll();

      window.addEventListener("scroll", this._onScroll, {
        passive: true,
      });
      window.addEventListener("resize", this._onScroll, {
        passive: true,
      });
    }

    disconnectedCallback() {
      window.removeEventListener("scroll", this._onScroll);
      window.removeEventListener("resize", this._onScroll);
    }

    _onScroll() {
      const boundingClientRect = this.getBoundingClientRect();

      // Calculate scroll percent as center point of the region's vertical position in the window
      const scrollPercent =
        (boundingClientRect.top + boundingClientRect.height / 2) /
        window.innerHeight;

      this.style.setProperty("--scroll-pct", String(scrollPercent));
    }
  }

  customElements.define("scroll-progress-region", ScrollProgressRegion);
}
