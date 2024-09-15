class ImgSequence extends HTMLElement {
  connectedCallback() {
    const sourceTags = this.getElementsByTagName("source");

    const sourceCount = sourceTags.length;
    const sources = new Array(sourceCount);

    for (let i = 0; i < sourceCount; ++i) {
      sources[i] = sourceTags[i].src;
    }

    const canvas = document.createElement("canvas");
    const dataCanvasWidth = this.dataset.imgWidth;
    const dataCanvasHeight = this.dataset.imgHeight;
    if (dataCanvasWidth) {
      canvas.width = Number(dataCanvasWidth);
    }
    if (dataCanvasHeight) {
      canvas.height = Number(dataCanvasHeight);
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    this.querySelector("img")?.replaceWith(canvas);

    let currentImageIndex = 0;

    /**
     * @type {Array<HTMLImageElement>}
     */
    const images = new Array(sourceCount);

    const dataScrollRangeStart = this.dataset.scrollRangeStart;
    let scrollRangeStart = 0.2;
    /**
     * @type {(() => void) | undefined}
     */
    let recalculateScrollRangeStart;
    if (dataScrollRangeStart === "auto") {
      recalculateScrollRangeStart = () => {
        const boundingRect = this.getBoundingClientRect();
        const absoluteYPos =
          window.innerHeight -
          (boundingRect.top + boundingRect.height / 2 + window.scrollY);

        scrollRangeStart = Math.max(absoluteYPos / window.innerHeight, 0);
      };
    } else if (dataScrollRangeStart) {
      scrollRangeStart = Number(dataScrollRangeStart);
    }

    const dataScrollRangeEnd = this.dataset.scrollRangeEnd;
    const scrollRangeEnd = dataScrollRangeEnd
      ? Number(dataScrollRangeEnd)
      : 0.8;

    const updateImage = async () => {
      const boundingRect = this.getBoundingClientRect();
      const yPos =
        (window.innerHeight - (boundingRect.top + boundingRect.height / 2)) /
        window.innerHeight;

      const sourceIndex = Math.max(
        Math.min(
          Math.floor(
            ((yPos - scrollRangeStart) / (scrollRangeEnd - scrollRangeStart)) *
              sourceCount
          ),
          sourceCount - 1
        ),
        0
      );

      currentImageIndex = sourceIndex;

      // Start preloading frames surrounding the current one
      for (
        let i = Math.max(sourceIndex - 8, 0);
        i <= Math.min(sourceIndex + 8, sourceCount - 1);
        ++i
      ) {
        if (!images[i]) {
          images[i] = new Image();
          images[i].src = sources[i];
        }
      }

      const img = images[sourceIndex];

      if (!img.complete) {
        // Ensure the image is decoded before we proceed to draw it
        await img.decode();
        // If the current image has changed since we started loading this one, don't draw
        if (currentImageIndex !== sourceIndex) {
          return;
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };

    window.addEventListener("scroll", updateImage, {
      passive: true,
    });

    const recalculateImageSequencePosition = () => {
      recalculateScrollRangeStart?.();
      updateImage();
    };

    requestAnimationFrame(recalculateImageSequencePosition);
    window.addEventListener("resize", recalculateImageSequencePosition);
  }
}

window.customElements.define("img-sequence", ImgSequence);
