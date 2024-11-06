if (!customElements.get("img-sequence")) {
  class ImgSequence extends HTMLElement {
    async connectedCallback() {
      const backgroundImageURL = this.style
        .getPropertyValue("--spritesheet-url")
        .slice(4, -1);
      this.dataset.loading = "true";
      const image = new Image();
      image.onload = () => {
        console.log("LOADED");
        delete this.dataset.loading;
      };
      image.src = backgroundImageURL;
    }
  }

  customElements.define("img-sequence", ImgSequence);
}
