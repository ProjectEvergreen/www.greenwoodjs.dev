import '../navigation/navigation.js';
import styles from './header.module.css';

export default class Header extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header>
        <h1 class="${styles.heading}">Welcome to Greenwood!</h1>
        <app-navigation></app-navigation>
      </header>
    `;
  }
}

customElements.define('app-header', Header);