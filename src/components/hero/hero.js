// CSS Modules would also be really nice here!
// might work better here for pure static content instead of needing a <style> tag
// note: we don't need a plugin for this in the browser (but likely will need to adapt this for NodeJS / bundling)
import sheet from './hero.css' with { type: "css" };
// making an assumption here that the standard would return a template element
// this plus DOM Parts could provide a really nice templating solution
import template from "./hero.html" with { type: "html" };

export default class HeroBanner extends HTMLElement {
  connectedCallback() {
    if(!this.shadowRoot) {
      console.log({ sheet, template });

      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this.shadowRoot.adoptedStyleSheets = [sheet];
    }
  }
}

customElements.define('app-hero', HeroBanner)