// CSS Modules would also be really nice here!
// might work better here for pure static content instead of needing a <style> tag
// npte: we don't need a plugin for this in the browser (but likely will need to adapt this for NodeJS / bundling)
import css from './hero.css' with { type: "css" };
import html from "./hero.html" with { type: "html" };

export default class HeroBanner extends HTMLElement {
  connectedCallback() {
    if(!this.shadowRoot) {
      console.log({ css, html });
      const template = document.createElement('template');
      template.innerHTML = html;

      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this.shadowRoot.adoptedStyleSheets = [css];
    }
  }
}

customElements.define('app-hero', HeroBanner)