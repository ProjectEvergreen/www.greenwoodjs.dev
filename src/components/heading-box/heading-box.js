import styles from "./heading-box.module.css";

export default class HeadingBox extends HTMLElement {
  connectedCallback() {
    const heading = this.getAttribute("heading");

    this.innerHTML = `
      <div class="${styles.container}">
        <h1 class="${styles.heading}" role="heading">${heading}</h1>
        <div class="${styles.slotted}" role="details">
          ${this.innerHTML}
        </div>
      </div>
    `;
  }
}

customElements.define("app-heading-box", HeadingBox);
