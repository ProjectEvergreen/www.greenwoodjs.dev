import styles from "./hero-banner.module.css";

export default class HeroBanner extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="${styles.container}">
        <h1 class="${styles.heading}">The Fullstack web is here<h1>

        <p class="${styles.headingSub}">Greenwood is your workbench for the web, embracing web standards from the ground up to empower your stack from front to back.</p>

        <button class="${styles.buttonBlitz}">
          <a href="#">View in Stackblitz</a>
        </button>
        
        <button class="${styles.buttonStarted}">
          <a href="#" class="${styles.linkStarted}">Get Started</a>
        </button>
        
        <div class="${styles.snippet}">
          <pre>$ npx @greenwood/init@latest</pre>
        </div>
      <div>
    `;
  }
}

customElements.define("app-hero-banner", HeroBanner);
