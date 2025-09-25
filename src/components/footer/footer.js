import styles from "./footer.module.css";
import greenwoodLogo from "../../assets/greenwood-logo-full.svg?type=raw";
import "../social-tray/social-tray.js";

export default class Footer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="${styles.footer}">
        <div class="${styles.flexContainer}">
          <div class="${styles.logo}">
            ${greenwoodLogo}
          </div>

          <div class="${styles.netlifyBanner}">
            <a href="https://www.netlify.com/">This site is powered by Netlify</a>
          </div>

          <app-social-tray></app-social-tray>

          <div class="${styles.netlifyBannerMobile}">
            <a href="https://www.netlify.com/">This site is powered by Netlify</a>
          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define("app-footer", Footer);
