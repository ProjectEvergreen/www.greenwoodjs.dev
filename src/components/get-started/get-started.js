import styles from "./get-started.module.css";

export default class GetStarted extends HTMLElement {
  connectedCallback() {
    const code = "npx @greenwood/init@latest";

    this.innerHTML = `
      <div class="${styles.container}">
        <h3 class="${styles.heading}">Get started in seconds 🚀</h3>

        <div class="${styles.snippet}">
          <pre>${code}</pre>
          <app-ctc content="${code}">
          </app-ctc>
        </div>

        <div>
          <button class="${styles.buttonBlitz}">
            <a href="#">View in Stackblitz</a>
          </button>
          
          <button class="${styles.buttonStarted}">
            <a href="#" class="${styles.linkStarted}">Get Started</a>
          </button>
        </div>

      </div>
    `;
  }
}

customElements.define("app-get-started", GetStarted);
