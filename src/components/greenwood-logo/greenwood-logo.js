import greenwoodLogo from "../../assets/greenwood-logo.svg?type=raw";
import styles from "./greenwood-logo.module.css";

export default class GreenwoodLogo extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <span class="${styles.logo}">
        ${greenwoodLogo}
      <span>
    `;
  }
}

customElements.define("app-greenwood-logo", GreenwoodLogo);
