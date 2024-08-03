import { getCollectionByRoute } from "@greenwood/cli/src/data/queries.js";

export default class SideNav extends HTMLElement {
  async connectedCallback() {
    const heading = this.getAttribute("heading") || "";
    const route = this.getAttribute("route") || "";
    const content = (await getCollectionByRoute(route)).filter((page) => page.label !== "Index");
    const sections = {};

    content.forEach((item) => {
      const segments = item.route.replace(`${route}`, "").split("/");

      segments.forEach((segment, idx) => {
        if (segment && segment !== "") {
          if (idx + 1 < segments.length - 1) {
            if (!sections[segment]) {
              sections[segment] = [];
            }

            sections[segment].push(item);
          }
        }
      });
    });
    console.log('SIDE NAV', { content, sections });

    this.innerHTML = `
      <h2>${heading}</h2>
      ${Object.keys(sections)
        .map((section) => {
          const items = sections[section];

          return `
            <h3>${section}</h3>
            <ul>
              ${items
                .map((item) => {
                  const { label, route } = item;

                  return `
                  <li><a href="${route}">${label}</a></li>
                `;
                })
                .join("")}
            </ul>
          `;
        })
        .join("")}
      <p>^^^ custom element using getCollection + attributes</p>
    `;
  }
}

customElements.define("app-side-nav", SideNav);
