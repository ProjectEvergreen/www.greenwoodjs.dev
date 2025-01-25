import styles from "./footer.module.css";
import greenwoodLogo from "../../assets/greenwood-logo-full.svg?type=raw";
import "../social-tray/social-tray.js";

export default class Footer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="${styles.footer}">
        <div class="${styles.logo}">
          ${greenwoodLogo}
        </div>

        <app-social-tray></app-social-tray>
      </footer>
    `;
  }
}

customElements.define("app-footer", Footer);
