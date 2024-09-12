import { getContent } from "@greenwood/cli/src/data/queries.js";
import styles from "./table-of-contents.module.css";

export default class TableOfContents extends HTMLElement {
  async connectedCallback() {
    const route = this.getAttribute("route") ?? "";
    const page = (await getContent()).find((page) => page.route === route);
    const { tableOfContents = [] } = page?.data ?? {};

    if (tableOfContents.length === 0) {
      return;
    }

    this.innerHTML = `
      <button popovertarget="onthispage" class="${styles.tocMenuTrigger}" aria-label="Table of Contents Menu">
        On this page &#9660;
      </button>
      <div id="onthispage" class="${styles.tocMenu}" popover>
        <h2 class="${styles.tocMenuHeading}">Table of Contents</h2>
        <ol>
        ${tableOfContents
          .map((item) => {
            const { content, slug } = item;

            return `
              <li class="${styles.tocMenuItem}">
                <a href="#${slug}" popovertarget="onthispage" popovertargetaction="hide">${content}</a>
              </li>
            `;
          })
          .join("")}
        </ol>
      </div>
    `;
  }
}

customElements.define("app-toc", TableOfContents);
