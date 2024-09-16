{
  class ImgSequence extends HTMLElement {
    connectedCallback() {
      const sourceTags = this.getElementsByTagName("source");

      const sourceCount = sourceTags.length;

      /**
       * @type {Array<HTMLImageElement>}
       */
      const images = new Array(sourceCount);

      for (let i = 0; i < sourceCount; ++i) {
        const img = new Image();
        img.fetchPriority = "low";
        img.src = sourceTags[i].src;
        images[i] = img;
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

      /**
       * @type {number | null}
       */
      let currentImageIndex = null;

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
              ((yPos - scrollRangeStart) /
                (scrollRangeEnd - scrollRangeStart)) *
                sourceCount
            ),
            sourceCount - 1
          ),
          0
        );

        if (sourceIndex === currentImageIndex) {
          return;
        }

        if (currentImageIndex !== null) {
          // Abort loading of previous image
          const previousImage = images[currentImageIndex];
          previousImage.dispatchEvent(new Event("abort"));
          previousImage.fetchPriority = "low";
        }

        currentImageIndex = sourceIndex;

        const img = images[sourceIndex];
        img.fetchPriority = "high";

        if (img.complete) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        } else {
          /** @type {Promise<void>} */ (
            new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
              img.onabort = reject;
            }).then(
              () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
              },
              () => {}
            )
          );
        }
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
}
