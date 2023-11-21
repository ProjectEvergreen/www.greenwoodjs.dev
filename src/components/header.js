import styles from './header.module.css';

export default class Header extends HTMLElement {
  connectedCallback() {
    console.log({ styles });
    this.innerHTML = `
      <h1 class="${styles.heading}">Welcome to Greenwood!</h1>
    `;
  }
}

customElements.define('app-header', Header);