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

          <nav class="cards">
            <ul>
              ${Array.from(this.cards)
                .map((card, idx) => {
                  const title = card.querySelector("span").innerHTML;
                  const text = card.querySelector("p").innerHTML;
                  const icon = card.querySelector("i").textContent;
                  const isActiveClass = idx === this.index ? " active" : "";

                  return `
                    <li class="card${isActiveClass}" data-idx="${idx}">
                      <h4>
                        <img src="/assets/${icon}" alt="${text} icon"/>
                        ${title}
                      </h4>
                    </li>
                  `;
                })
                .join("")}
            </ul>
          </nav>

          <p>${this.cards[this.index].querySelector("p").innerHTML}</p>
          <div class="snippet">${this.cards[this.index].querySelector("pre").outerHTML}</div>
        </div>
      `;

      // TODO if going with the above option, rename cards related classes
      // if (this.cards.length > 0) {
      //   template.innerHTML = `
      //     <div class="walkthrough">
      //       <h2>Go from Zero to Fullstack with web standards</h2>
      //       <h3>Lorum Ipsum...</h3>

      //       <div class="row">
      //         <div class="column-left">
      //           ${Array.from(this.cards)
      //             .map((card, idx) => {
      //               const title = card.querySelector("span").innerHTML;
      //               const text = card.querySelector("p").innerHTML;
      //               const icon = card.querySelector("i").textContent;
      //               const isActiveClass = idx === this.index ? " active" : "";

      //               return `
      //                 <div class="card${isActiveClass}" data-idx="${idx}">
      //                   <h4>
      //                     <img src="/assets/${icon}" alt="${text} icon"/>
      //                     ${title}
      //                   </h4>
      //                   <p>${text}</p>
      //                 </div>
      //               `;
      //             })
      //             .join("")}
      //         </div>

      //         <div class="snippet column-right">${this.cards[this.index].querySelector("pre").outerHTML}</div>
      //       </div>
      //     </div>
      //   `;

      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this.shadowRoot.adoptedStyleSheets = [theme, sheet];
      this.shadowRoot
        .querySelectorAll(".card")
        .forEach((item) => item.addEventListener("click", this.selectItem.bind(this)));
    } else {
      console.debug("no walkthrough content cards detected");
    }
  }

  selectItem(event) {
    const cards = this.shadowRoot.querySelectorAll(".card");
    const index = (this.index = event.currentTarget.dataset.idx);

    this.shadowRoot.querySelector(".snippet").innerHTML =
      this.cards[this.index].querySelector("pre").outerHTML;

    this.shadowRoot.querySelector("p").innerHTML =
      this.cards[this.index].querySelector("p").innerHTML;

    cards.forEach((card) => {
      card.dataset.idx === index ? card.classList.add("active") : card.classList.remove("active");
    });
  }
}

customElements.define("app-walkthrough", Walkthrough);
