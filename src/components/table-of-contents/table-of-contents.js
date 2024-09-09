import { getContent } from "@greenwood/cli/src/data/queries.js";

export default class TableOfContents extends HTMLElement {
  async connectedCallback() {
    const route = this.getAttribute("route") ?? "";
    const page = (await getContent()).find((page) => page.route === route);
    // maybe call the frontmatter toc as well?
    const { tableOfContents = [] } = page?.data ?? {};
    // console.log({ route, page, tableOfContents });

    if (tableOfContents.length === 0) {
      return;
    }

    this.innerHTML = `
      <h2>On This Page (${page.title})</h2>
      <ol>
      ${tableOfContents
        .map((item) => {
          const { content, slug } = item;

          return `
            <li><a href="#${slug}">${content}</a></li>
          `;
        })
        .join("")}
      </ol>
    `;
  }
}

customElements.define("app-toc", TableOfContents);
