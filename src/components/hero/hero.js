// import html from './hero.html?type=html';
import html from "./hero.html" with { type: "html" };

console.log({ html });
// CSS Modules would also be really nice here!
export default class HeroBanner extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      ${html}
    `
  }
}

customElements.define('app-hero', HeroBanner)