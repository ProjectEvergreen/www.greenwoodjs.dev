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
    this.cards = globalThis.document?.querySelectorAll(".walkthrough-card") || [];

    if (this.cards.length > 0) {
      template.innerHTML = `
        <div class="walkthrough">
          <h2>Go from Zero to Fullstack with web standards</h2>
          <h3>Lorum Ipsum...</h3>

          <div class="row">
            <div class="column-left">
              ${Array.from(this.cards)
                .map((card, idx) => {
                  const title = card.querySelector("span").innerHTML;
                  const text = card.querySelector("p").innerHTML;

                  return `
                    <div class="card">
                      <h4 data-idx="${idx}">${title}</h4>
                      <p>${text}</p>
                    </div>
                  `;
                })
                .join("")}
            </div>

            <div class="snippet column-right">${this.cards[this.index].querySelector("pre").outerHTML}</div>
          </div>
        </div>
      `;

      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this.shadowRoot.adoptedStyleSheets = [theme, sheet];
      this.shadowRoot
        .querySelectorAll(".card h4")
        .forEach((item) => item.addEventListener("click", this.selectItem.bind(this)));
    } else {
      console.debug("no walkthrough content cards detected");
    }
  }

  selectItem(event) {
    this.index = event.currentTarget.dataset.idx;
    this.shadowRoot.querySelector(".snippet").innerHTML =
      this.cards[this.index].querySelector("pre").outerHTML;
  }
}

customElements.define("app-walkthrough", Walkthrough);
