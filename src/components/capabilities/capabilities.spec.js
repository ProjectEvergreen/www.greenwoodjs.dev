import { expect } from "@esm-bundle/chai";
import "./capabilities.js";

describe("Components/Capabilities", () => {
  let capabilities;

  before(async () => {
    capabilities = document.createElement("app-capabilities");

    const capability1 = document.createElement("div");
    const capability2 = document.createElement("div");

    capability1.setAttribute("class", "capabilities-content item1");
    capability1.innerHTML = `
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
    `;

    capability2.setAttribute("class", "capabilities-content item2");
    capability2.innerHTML = `
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
    `;

    document.body.appendChild(capability1);
    document.body.appendChild(capability2);
    document.body.appendChild(capabilities);

    await capabilities.updateComplete;
  });

  describe("Default Behavior", () => {
    it("should not be null", () => {
      expect(capabilities).not.equal(undefined);
    });

    it("should have the expected number of list items from user generated content", () => {
      const items = capabilities.shadowRoot.querySelectorAll(".sections li");

      expect(items.length).to.equal(2);
    });

    it("should have the expected capability headings", () => {
      const headings = capabilities.shadowRoot.querySelectorAll(".sections .capability-heading");

      expect(headings.length).to.equal(2);
      expect(headings[0].innerHTML).to.contain("Hybrid Routing");
      expect(headings[1].innerHTML).to.contain("Web Components");
    });

    it("should have the expected default description content from item 1 in the content section", () => {
      const content = capabilities.shadowRoot.querySelectorAll(".content");

      expect(content.length).to.equal(1);
      expect(content[0].innerHTML).to.contain("Greenwood is HTML first by design.");
    });

    it("should have the expected default code content from item 1 in the snippet section", () => {
      const snippet = capabilities.shadowRoot.querySelectorAll(".snippet");

      expect(snippet.length).to.equal(1);
      expect(snippet[0].innerHTML).to.contain(
        "Dynamic (SSR), or emit as static with pre-rendering",
      );
    });
  });
  after(() => {
    capabilities.remove();
    capabilities = null;
  });
});
