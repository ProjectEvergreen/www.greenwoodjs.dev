import "./capabilities.js";

export default {
  title: "Components/Capabilities",
};

const Template = () => `
  <div class="capabilities-content item1" style="display: none">
    <span>Hybrid Routing</span>
    <i>html.svg</i>
    <p>Greenwood is HTML first by design.  Start from just an <em>index.html</em> file or leverage <strong>hybrid, file-system based routing</strong> to easily achieve static and dynamic pages side-by-side.  Single Page Applications (SPA) also supported.</p>

    <pre>
    src/
      pages/
        api/
          search.js       # API route
        index.html        # Static (SSG)
        products.js       # Dynamic (SSR), or emit as static with pre-rendering
        about.md          # markdown also supported
    </pre>
  </div>

  <div class="capabilities-content item2" style="display: none">
    <span>Web Components</span>
    <i>web-components.svg</i>
    <p>Greenwood makes it possible to author real isomorphic Web Components, using Light or Shadow DOM, re-using that same definition across the server and client side.  Combined with Web APIs like <em>Constructable Stylesheets</em> and <em>Import Attributes</em>, Web Components make for a compelling solution as the web's own component model.</p>

    <pre>
    // src/components/card.js
    import themeSheet from "../styles/theme.css" with { type: "css" };
    import cardSheet from "./card.css" with { type: "css" };

    class Card extends HTMLElement {
      connectedCallback() {
        if (!this.shadowRoot) {
          const thumbnail = this.getAttribute("thumbnail");
          const title = this.getAttribute("title");
          const template = document.createElement("template");

          template.innerHTML = '...'
          this.attachShadow({ mode: "open" });
          this.shadowRoot.appendChild(template.content.cloneNode(true));
        }

        this.shadowRoot.adoptedStyleSheets = [themeSheet, cardSheet];
      }
    }

    customElements.define("app-card", Card);
    </pre>

  </div>

  <app-capabilities></app-capabilities>
`;

export const Primary = Template.bind({});
