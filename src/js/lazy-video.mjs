if (!customElements.get("lazy-video")) {
  class LazyVideo extends HTMLElement {
    static observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(async (entry) => {
          if (entry.isIntersecting) {
            entry.target.dispatchEvent(new Event("l-visible"));
          }
        });
      },
      {
        rootMargin: "100px",
      }
    );

    connectedCallback() {
      this.video = this.querySelector("video");
      if (!this.video) {
        console.error("No video element found in lazy-video");
        return;
      }

      this.addEventListener("l-visible", this.onVisible.bind(this));

      LazyVideo.observer.observe(this);
    }

    disconnectedCallback() {
      LazyVideo.observer.unobserve(this);
    }

    onVisible() {
      const video = this.video;
      if (!video) return;

      LazyVideo.observer.unobserve(this);

      video.setAttribute("preload", "metadata");

      if (this.dataset.autoplay !== undefined) {
        video.muted = true;
        // If the lazy-video element has a controls attribute set,
        // we should keep the controls even if autoplay is also set
        if (!this.hasAttribute("controls")) {
          video.controls = false;
        }
        video.play().catch((e) => {
          if (e instanceof DOMException && e.name === "NotAllowedError") {
            // Show controls if autoplay is not allowed
            video.controls = true;
          }
        });
      }
    }
  }

  customElements.define("lazy-video", LazyVideo);
}
