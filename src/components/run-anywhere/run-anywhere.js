import styles from "./run-anywhere.module.css";

export default class RunAnywhere extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="${styles.container}">
        <h3>Run anywhere the run can run</h3>
        <p>Greenwood Lorum Ipsum...</p>
        <img src="/assets/vercel.svg" alt="Vercel logo"/>
        <img src="/assets/netlify.png" alt="Netlify logo"/>
      </div>
    `;
  }
}

customElements.define("app-run-anywhere", RunAnywhere);
