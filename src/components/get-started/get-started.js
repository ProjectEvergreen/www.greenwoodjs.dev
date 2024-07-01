import styles from "./get-started.module.css";

export default class GetStarted extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="${styles.container}">
        <h3 class="${styles.heading}">Get Started in seconds</h3>

        <div class="${styles.snippet}">
          <pre>$ npx @greenwood/init@latest</pre>
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
