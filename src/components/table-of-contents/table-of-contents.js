import { getContent } from "@greenwood/cli/src/data/client.js";
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
      <div class="${styles.fullMenu}" data-full>
        <h2 role="heading">On This Page</h2>
        <ol>
        ${tableOfContents
          .map((item) => {
            const { content, slug } = item;

            return `
              <li>
                <a href="#${slug}">${content}</a>
              </li>
            `;
          })
          .join("")}
        </ol>
      </div>
      <div class="${styles.compactMenu}" data-compact>
        <button popovertarget="onthispage" class="${styles.compactMenuTrigger}" aria-label="Table of Contents Menu">
          On This Page
          <span id="indicator">&#9660;</span>
        </button>
        <div id="onthispage" class="${styles.compactMenuPopover}" popover="manual">
          <button class="${styles.compactMenuCloseButton}" popovertarget="onthispage" popovertargetaction="hide" aria-label="Compact Menu Close Button">
            &times;
          </button>
          <ol>
          ${tableOfContents
            .map((item) => {
              const { content, slug } = item;

              return `
                <li class="${styles.compactMenuItem}">
                  <a href="#${slug}">${content}</a>
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
