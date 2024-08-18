import styles from "./capabilities.css?type=raw";
import theme from "../../styles/theme.css?type=raw";
import api from "../../assets/api-routes.svg?type=raw";
import ssg from "../../assets/build-ssg.svg?type=raw";
import html from "../../assets/html.svg?type=raw";
import webComponents from "../../assets/web-components.svg?type=raw";

const template = document.createElement("template");

// front-loading these so we can use "real" SVG content in our component instead of <img>
// as styling for hover states can be entirely through CSS
// as a result yes, these images are hardcoded here, but oh well
const availableIconSVGs = {
  "api-routes.svg": api,
  "html.svg": html,
  "build-ssg.svg": ssg,
  "web-components.svg": webComponents,
};

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
          <style>
            ${theme}
            ${styles}
          </style>
          <div class="container">
            <h2>Go from zero to fullstack with web standards</h2>
            <!-- <h3>Greenwood loves the web and so where possible we borrow, promote and adapt powerful web standards like Web Components, Fetch (and friends), and Import Attributes to provide a refreshingly predictable developer experience.</h3> -->

            <nav class="sections">
              <ul>
                ${Array.from(this.contentItems)
                  .map((item, idx) => {
                    const title = item.querySelector("span").innerHTML;
                    const icon = item.querySelector("i").textContent;
                    const isActiveClass = idx === this.index ? " active" : "";

                    return `
                      <li class="section${isActiveClass}" data-idx="${idx}">
                        <h4>
                          ${availableIconSVGs[icon]}
                          <span>${title}</span>
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
