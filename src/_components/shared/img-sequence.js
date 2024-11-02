if (!customElements.get("img-sequence")) {
  class ImgSequence extends HTMLElement {
    async connectedCallback() {
      if (window.matchMedia("(prefers-reduced-data: reduce)").matches) {
        // If the user has enabled data saving mode, we'll bail out early
        return;
      }

      const placeholderImage = this.querySelector("img");
      if (!placeholderImage) {
        return;
      }

      if (!placeholderImage.complete) {
        // Wait for the placeholder image to load to get a sense
        // for the connection speed we're working with.
        // If the image doesn't load within 300ms, we're dealing with a slower
        // connection which is going to struggle to deliver a good experience
        // for the image sequence, so we'll bail out and just stick with the placeholder.
        await new Promise((resolve, reject) => {
          const tid = setTimeout(() => {
            reject("Timeout");
          }, 300);
          placeholderImage.onload = () => {
            clearTimeout(tid);
            resolve(1);
          };
        });
      }

      const basePath = this.dataset.basePath;

      const fileExtension = this.dataset.ext;
      const endIndex = Number(this.dataset.idxEnd);
      const sourceCount = endIndex + 1;

      const indexPaddingLength = String(endIndex).length;

      /**
       * @type {Array<HTMLImageElement>}
       */
      const images = new Array(sourceCount);

      for (let i = 0; i < sourceCount; ++i) {
        const img = new Image();
        img.fetchPriority = "low";
        img.src = `${basePath}/${String(i).padStart(
          indexPaddingLength,
          "0"
        )}.${fileExtension}`;
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

  customElements.define("img-sequence", ImgSequence);
}
