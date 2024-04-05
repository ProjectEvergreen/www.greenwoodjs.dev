// TODO - nice to have - https://github.com/ProjectEvergreen/greenwood-getting-started/pull/85#discussion_r1549999231
// const template = document.createElement('template');

// template.innerHTML = `
//   <footer>
//     <h4>GreenwoodJS &copy;${new Date().getFullYear()}
//   </footer>
// `;

export default class Footer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer>
        <h4>GreenwoodJS &copy;${new Date().getFullYear()}</h4>
      </footer>
    `;
  }
}

customElements.define('app-footer', Footer);