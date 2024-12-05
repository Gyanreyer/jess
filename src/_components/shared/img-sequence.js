if (!customElements.get("img-sequence")) {
  class ImgSequence extends HTMLElement {
    connectedCallback() {
      const image = this.getElementsByTagName("img")[0];
      if (image && !image.complete) {
        this.dataset.loading = "true";
        image.onload = () => {
          delete this.dataset.loading;
        };
      }
    }
  }

  customElements.define("img-sequence", ImgSequence);
}
