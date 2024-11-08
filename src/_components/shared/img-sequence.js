if (!customElements.get("img-sequence")) {
  class ImgSequence extends HTMLElement {
    connectedCallback() {
      this.dataset.loading = "true";
      const backgroundImageURL = this.style
        .getPropertyValue("--spritesheet-url")
        .slice(5, -2);
      const image = new Image();
      image.onload = () => {
        delete this.dataset.loading;
      };
      image.src = backgroundImageURL;
    }
  }

  customElements.define("img-sequence", ImgSequence);
}
