import styles from "./why-greenwood.module.css";

export default class WhyGreenwood extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="${styles.container}">
        <h3>Why Greenwood?</h3>
        <p>Greenwood Lorum Ipsum...</p>
      </div>
    `;
  }
}

customElements.define("app-why-greenwood", WhyGreenwood);
