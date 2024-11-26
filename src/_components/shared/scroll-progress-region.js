if (!customElements.get("scroll-progress-region")) {
  /**
   * A custom element that provides a CSS custom property `--scroll-pct` which maps to
   * the scroll progress of the region. The scroll progress is a value between -1 and 2.
   * -1 indicates that the region is below the viewport, 0 indicates that the region's bottom
   * edge aligns with the bottom edge of the viewport, 1 indicates that the region's top edge
   * aligns with the top edge of the viewport, and 2 indicates that the region is above the viewport.
   *
   * Accepts an optional data-scroll-margin attribute which can be a percentage or pixel value. This works a bit
   * like intersection observer's rootMargin, in that it allows you to specify a margin to extend the edges of the region.
   * For instance, data-scroll-margin="10%" will make the region start when 90% is visible from the bottom of the viewport,
   * and end when 10% is scrolled past the top of the viewport.
   */
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

      let scrollMargin = 0;
      const dataScrollMargin = this.dataset.scrollMargin;
      if (dataScrollMargin) {
        if (dataScrollMargin.endsWith("%")) {
          // Percentage values are relative to the height of the region
          scrollMargin =
            (parseInt(dataScrollMargin, 10) * boundingClientRect.height) / 100;
        } else {
          // Treat as pixel value
          scrollMargin = parseInt(dataScrollMargin, 10);
        }
      }

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      const yPos = boundingClientRect.top + scrollY;

      // Scroll position where the bottom of the region aligns with the bottom edge of the viewport
      const startPointScrollY = Math.max(
        yPos + boundingClientRect.height - windowHeight - scrollMargin,
        // Clamp to 0 so regions near the top of the page can still have a start point of 0
        0
      );
      // Scroll position where the top of the region aligns with the top edge of the viewport
      const endPointScrollY = yPos + scrollMargin;

      const scrollPercent = Math.min(
        Math.max(
          1 -
            (scrollY - startPointScrollY) /
              (endPointScrollY - startPointScrollY),
          -1
        ),
        2
      );

      this.style.setProperty("--scroll-pct", String(scrollPercent));
    }
  }

  customElements.define("scroll-progress-region", ScrollProgressRegion);
}
