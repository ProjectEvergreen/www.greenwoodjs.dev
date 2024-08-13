import styles from "./hero-banner.module.css";
import emphasis from "../../assets/emphasis-corner.svg?type=raw";

export default class HeroBanner extends HTMLElement {
  connectedCallback() {
    const code = "npx @greenwood/init@latest";

    this.innerHTML = `
      <div class="${styles.container}">
        <h1 class="${styles.heading}">The fullstack web is <strong class="${styles.headingEmphasis}">here</strong></h1>

        <p class="${styles.headingSub}">Greenwood is your workbench for the web, embracing web standards from the ground up to empower your stack from front to back.</p>

        <div class="${styles.ctaContainer}">
          <a href="#" class="${styles.buttonBlitz}">
            <span>View in Stackblitz</span>
          </a>
          
          <a href="#" class="${styles.buttonStarted}">
            <span>Get Started</span>
          </a>

          <div class="${styles.snippetContainer}">
            <div class="${styles.snippet}">
              <pre>${code}</pre>
              <app-ctc content="${code}">
              </app-ctc>
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
