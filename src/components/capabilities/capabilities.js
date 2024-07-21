import sheet from "./capabilities.css" with { type: "css" };
import theme from "../../styles/theme.css" with { type: "css" };

const template = document.createElement("template");

export default class Capabilities extends HTMLElement {
  constructor() {
    super();
    this.index = 0;
    this.content = [];
  }

  connectedCallback() {
    this.contentItems = globalThis.document?.querySelectorAll(".capabilities-content") || [];

    if (this.contentItems.length > 0) {
      template.innerHTML = `
        <div class="capabilities">
          <div class="container">
            <h2>Go from zero to fullstack with web standards</h2>
            <!-- <h3>Greenwood loves the web and so where possible we borrow, promote and adapt powerful web standards like Web Components, Fetch (and friends), and Import Attributes to provide a refreshingly predictable developer experience.</h3> -->

            <nav class="sections">
              <ul>
                ${Array.from(this.contentItems)
                  .map((item, idx) => {
                    const title = item.querySelector("span").innerHTML;
                    const text = item.querySelector("p").innerHTML;
                    const icon = item.querySelector("i").textContent;
                    const isActiveClass = idx === this.index ? " active" : "";

                    return `
                      <li class="section${isActiveClass}" data-idx="${idx}">
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

            <p>${this.contentItems[this.index].querySelector("p").innerHTML}</p>
            <div class="snippet">${this.contentItems[this.index].querySelector("pre").outerHTML}</div>
          </div>
        </div>
      `;

      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this.shadowRoot.adoptedStyleSheets = [theme, sheet];
      this.shadowRoot
        .querySelectorAll(".section")
        .forEach((item) => item.addEventListener("click", this.selectItem.bind(this)));
    } else {
      console.debug("no capabilities content sections detected");
    }
  }

  selectItem(event) {
    const sections = this.shadowRoot.querySelectorAll(".section");
    const index = (this.index = event.currentTarget.dataset.idx);

    this.shadowRoot.querySelector(".snippet").innerHTML =
      this.contentItems[this.index].querySelector("pre").outerHTML;

    this.shadowRoot.querySelector("p").innerHTML =
      this.contentItems[this.index].querySelector("p").innerHTML;

    sections.forEach((section) => {
      section.dataset.idx === index
        ? section.classList.add("active")
        : section.classList.remove("active");
    });
  }
}

customElements.define("app-capabilities", Capabilities);
