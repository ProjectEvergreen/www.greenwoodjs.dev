import sheet from "./walkthrough.css" with { type: "css" };
import theme from "../../styles/theme.css" with { type: "css" };

const template = document.createElement("template");

export default class Walkthrough extends HTMLElement {
  constructor() {
    super();
    this.index = 0;
    this.cards = [];
  }

  connectedCallback() {
    if (!this.shadowRoot) {
      this.cards = globalThis.document?.querySelectorAll(".walkthrough-card") || [];

      template.innerHTML = `
        <div class="walkthrough">
          <h3>${this.cards[this.index]?.querySelector("p").innerHTML}</h3>

          <ol>
            ${Array.from(this.cards)
              .map((card, idx) => {
                const label = card?.querySelector("span").innerHTML;

                return `<li data-idx="${idx}">${label}</li>`;
              })
              .join("")}
          </ol>

          <div class="snippet">${this.cards[this.index]?.querySelector("pre").innerHTML}</div>
        </div>
      `;

      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    this.shadowRoot.adoptedStyleSheets = [theme, sheet];
    this.shadowRoot
      .querySelectorAll("li")
      ?.forEach((item) => item.addEventListener("click", this.selectItem.bind(this)));
  }

  selectItem(event) {
    console.log("selectItem", event.currentTarget.dataset.idx);
    this.index = event.currentTarget.dataset.idx;
    this.shadowRoot.querySelector("h3").innerHTML =
      this.cards[this.index].querySelector("p").innerHTML;
    this.shadowRoot.querySelector(".snippet").innerHTML =
      this.cards[this.index].querySelector("pre").innerHTML;
  }
}

customElements.define("app-walkthrough", Walkthrough);
