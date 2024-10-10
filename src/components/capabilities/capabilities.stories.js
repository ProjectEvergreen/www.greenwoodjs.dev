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
  <div class="capabilities-content item3" style="display: none">
    <span>API Routes</span>
    <i>json.svg</i>
    <span>API Routes</span>

  <p>Need client side data fetching or mutations?  Greenwood provides API routes out of the box that are fully invested in web standards like <code>Fetch</code> and <code>FormData</code>.  Of course it is all fully compatible with server-rendering Web Components; a perfect companion for HTML over the wire solutions!</p>
  <pre>// src/pages/api/search.js
import { renderFromHTML } from "wc-compiler";
import { getProducts } from "../lib/db.js";

export async function handler(request) {
  const formData = await request.formData();
  const searchTerm = formData.has("term") ? formData.get("term") : "";
  const products = await getProducts(searchTerm);
  const { html } = await renderFromHTML(
    JS HERE,
    [new URL("../components/card.js", import.meta.url)],
  );

  return new Response(html, {
    headers: new Headers({
      "Content-Type": "text/html",
    }),
  });
}</pre>
  </div>

  <app-capabilities></app-capabilities>
`;

export const Primary = Template.bind({});
