import styles from './navigation.module.css';

export default class Navigation extends HTMLElement {
  connectedCallback() {
    console.log({ styles });
    this.innerHTML = `
      <nav>
        <ul class="${styles.nav}">
         <li class="${styles.listItem}">Docs | </li>
         <li class="${styles.listItem}">Guides | </li>
         <li class="${styles.listItem}">Blog</li>
      </nav>
    `;
  }
}

customElements.define('app-navigation', Navigation);