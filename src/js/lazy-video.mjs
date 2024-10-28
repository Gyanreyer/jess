{
  const lazyVideoTemplate = document.createElement("template");
  const videoSlot = document.createElement("slot");
  lazyVideoTemplate.appendChild(videoSlot);

  const lazyVideoObserver = new IntersectionObserver(
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

  class LazyVideo extends HTMLElement {
    connectedCallback() {
      this.video = this.querySelector("video");
      if (!this.video) {
        console.error("No video element found in lazy-video");
        return;
      }

      this.addEventListener("l-visible", this.onVisible.bind(this));

      lazyVideoObserver.observe(this);
    }

    disconnectedCallback() {
      lazyVideoObserver.unobserve(this);
    }

    onVisible() {
      const video = this.video;
      if (!video) return;

      lazyVideoObserver.unobserve(this);

      const dataSrc = this.dataset.src;
      if (dataSrc) {
        video.src = dataSrc;
      } else {
        const sources = this.querySelectorAll("source");
        video.append(...sources);
      }

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
