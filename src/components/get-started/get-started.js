import styles from "./get-started.module.css";

export default class GetStarted extends HTMLElement {
  connectedCallback() {
    const code = "npx @greenwood/init@latest my-app";

    this.innerHTML = `
      <div class="${styles.container}">
        <h3 class="${styles.heading}">Get started in seconds 🚀</h3>

        <div class="${styles.snippet}">
          <pre>&dollar; ${code}</pre>
          <app-ctc-button content="${code}">
          </app-ctc-button>
        </div>

        <div>
          <a href="https://stackblitz.com/github/projectevergreen/greenwood-getting-started" class="${styles.buttonBlitz}">
            <span>View in Stackblitz</span>
          </a>
          
          <a href="/guides/getting-started/" class="${styles.buttonStarted}">
            <span>Get Started</span>
          </a>
        </div>

      </div>
    `;
  }
}

customElements.define("app-get-started", GetStarted);
