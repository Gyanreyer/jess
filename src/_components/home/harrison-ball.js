if (!customElements.get("harrison-ball")) {
  class HarrisonBall extends HTMLElement {
    /**
     * @type {number | null}
     */
    frameID = null;
    /**
     * @type {number|null}
     */
    lastTime = null;
    /**
     * @type {number}
     */
    rotationSpeed = 0;
    /**
     * @type {number}
     */
    currentRotation = 0;

    constructor() {
      super();
      this._onHover = this._onHover.bind(this);
      this._rotate = this._rotate.bind(this);
    }

    connectedCallback() {
      this.addEventListener("pointerenter", this._onHover);
    }

    disconnectedCallback() {
      if (this.frameID) {
        cancelAnimationFrame(this.frameID);
      }
      this.removeEventListener("pointerenter", this._onHover);
    }

    _onHover() {
      this._rotate(performance.now());
    }

    /**
     * @param {number} timestamp
     */
    _rotate(timestamp) {
      this.frameID = requestAnimationFrame(this._rotate);

      if (!this.lastTime) {
        this.lastTime = timestamp;
        return;
      }

      const deltaTime = (timestamp - this.lastTime) / 1000;
      this.lastTime = timestamp;

      const isHovering = this.matches(":hover");

      if (isHovering) {
        this.rotationSpeed = Math.min(this.rotationSpeed + 1, 360);
      } else {
        this.rotationSpeed = Math.max(this.rotationSpeed - 3, 0);
      }

      if (this.rotationSpeed <= 0) {
        const newTargetRotation = this.currentRotation > 180 ? 360 : 0;
        this.style.transition = `transform ${
          Math.abs(newTargetRotation - this.currentRotation) / 60
        }s`;
        this.currentRotation = newTargetRotation;
        this.style.transform = `rotate(${this.currentRotation}deg)`;
        cancelAnimationFrame(this.frameID);
        return;
      }

      // Wrap rotation value between 0 and 360
      // Using this funky double-modulo because branchless is cool
      this.currentRotation =
        (((this.currentRotation - this.rotationSpeed * deltaTime) % 360) +
          360) %
        360;

      this.style.transition = "none";
      this.style.transform = `rotate(${this.currentRotation}deg)`;
    }
  }

  customElements.define("harrison-ball", HarrisonBall);
}
