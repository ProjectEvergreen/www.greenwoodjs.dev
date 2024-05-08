// TODO test with {type: css} compat
import styles from './footer.module.css';
// TODO - nice to have - https://github.com/ProjectEvergreen/greenwood-getting-started/pull/85#discussion_r1549999231
// const template = document.createElement('template');

// template.innerHTML = `
//   <footer>
//     <h4>GreenwoodJS &copy;${new Date().getFullYear()}
//   </footer>
// `;

export default class Footer extends HTMLElement {
  connectedCallback() {
    const year = `${new Date().getFullYear()}`;

    this.innerHTML = `
      <footer class="${styles.footer}">
        <h4>GreenwoodJS &copy;${year}</h4>
      </footer>
    `;
  }
}

customElements.define("app-footer", Footer);
