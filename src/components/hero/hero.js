// TODO how is this even working right now!?
// but somehow we're getting a CSSStyleSheet instance!?
// https://web.dev/articles/constructable-stylesheets#using_constructed_stylesheets
// maybe its ES Modules Shims? 
import styles from './hero.css?type=cssm'; // TODO use file based naming instead?

export default class Hero extends HTMLElement {
  connectedCallback() {
    document.adoptedStyleSheets.push(styles);

    this.innerHTML = `
      <h2 class="heading">Hello from Hero banner</h2>
    `
  }
}

customElements.define('app-hero', Hero);