import styles from "./hero-banner.module.css";
import emphasis from "../../assets/emphasis-corner.svg?type=raw";

export default class HeroBanner extends HTMLElement {
  connectedCallback() {
    const code = "npx @greenwood/init@latest my-app";

    this.innerHTML = `
      <div class="${styles.container}">
        <h1 class="${styles.heading}">The fullstack web is <strong class="${styles.headingEmphasis}">here</strong></h1>

        <p class="${styles.headingSub}">Greenwood is your workbench for the web, embracing web standards from the ground up to empower your stack from front to back.</p>

        <div class="${styles.ctaContainer}">
          <a href="https://stackblitz.com/github/projectevergreen/greenwood-getting-started" class="${styles.buttonBlitz}">
            <span>View in Stackblitz</span>
          </a>
          
          <a href="/guides/getting-started/" class="${styles.buttonStarted}">
            <span>Get Started</span>
          </a>

          <div class="${styles.snippetContainer}">
            <div class="${styles.snippet}">
              <pre>&dollar; ${code}</pre>
              <app-ctc-button content="${code}">
              </app-ctc-button>
            </div>
            <span class="${styles.emphasisCorner}">
              ${emphasis}
            </span>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("app-hero-banner", HeroBanner);
