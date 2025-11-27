import styles from "./get-started.module.css";

export default class GetStarted extends HTMLElement {
  connectedCallback() {
    const code = "npx @greenwood/init@latest";

    this.innerHTML = `
      <div class="${styles.container}">
        <h3 class="${styles.heading}">Get started in seconds 🚀</h3>

        <div class="${styles.snippet}">
          <pre>&dollar; ${code}</pre>
          <app-ctc-button content="${code}">
          </app-ctc-button>
        </div>

        <div>
          <a href="/docs/introduction/about/" class="${styles.buttonSecondary}">
            <span>Learn More</span>
          </a>
          
          <a href="/guides/getting-started/" class="${styles.buttonPrimary}">
            <span>Get Started</span>
          </a>
        </div>

      </div>
    `;
  }
}

customElements.define("app-get-started", GetStarted);
