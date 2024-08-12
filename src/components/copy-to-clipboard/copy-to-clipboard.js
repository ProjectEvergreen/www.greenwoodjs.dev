import copy from "../../assets/copy-button.svg?type=raw";
import copySheet from "./copy-to-clipboard.css" with {type: 'css' };

const template = document.createElement("template");

template.innerHTML = `
  <button id="icon" title="Copy to clipboard">${copy}</button>
`;

export default class CopyToClipboard extends HTMLElement {
  connectedCallback() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    this.shadowRoot.adoptedStyleSheets = [copySheet];

    this.shadowRoot.getElementById("icon")?.addEventListener("click", () => {
      const contents = this.getAttribute("content") ?? undefined;

      navigator.clipboard.writeText(contents);
      console.log("copying the following contents to your clipboard =>", contents);
    });
  }
}

customElements.define("app-ctc", CopyToClipboard);
