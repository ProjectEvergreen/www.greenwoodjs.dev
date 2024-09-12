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
      <div class="${styles.fullMenu}">
        <h2>On this page</h2>
        <ol>
        ${tableOfContents
          .map((item) => {
            const { content, slug } = item;

            return `
              <li class="${styles.compactMenuSectionListItem}">
                <a href="#${slug}">${content}</a>
              </li>
            `;
          })
          .join("")}
        </ol>
      </div>
      <div class="${styles.compactMenu}">
        <button popovertarget="onthispage" class="${styles.compactMenuTrigger}" aria-label="Table of Contents Menu">
          On this page &#9660;
        </button>
        <div id="onthispage" class="${styles.compactMenuPopover}" popover>
          <h2 class="${styles.compactMenuHeading}">Table of Contents</h2>
          <ol>
          ${tableOfContents
            .map((item) => {
              const { content, slug } = item;

              return `
                <li class="${styles.compactMenuItem}">
                  <a href="#${slug}" popovertarget="onthispage" popovertargetaction="hide">${content}</a>
                </li>
              `;
            })
            .join("")}
          </ol>
        </div>
      </div>
    `;
  }
}

customElements.define("app-toc", TableOfContents);
