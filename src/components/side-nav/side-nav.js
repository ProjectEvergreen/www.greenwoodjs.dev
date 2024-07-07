import { getCollectionByRoute } from "@greenwood/cli/src/data/queries.js";

export default class SideNav extends HTMLElement {
  async connectedCallback() {
    const heading = this.getAttribute("heading") || "";
    const route = this.getAttribute("route") || "";
    const guides = (await getCollectionByRoute(route)).filter((page) => page.label !== "Index");
    const sections = {};

    guides.forEach((guide) => {
      const segments = guide.route.replace("/guides/", "").split("/");

      segments.forEach((segment, idx) => {
        if (segment && segment !== "") {
          if (idx + 1 < segments.length - 1) {
            if (!sections[segment]) {
              sections[segment] = [];
            }

            sections[segment].push(guide);
          }
        }
      });
    });
    console.log({ guides });
    console.log({ sections });

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
      <p>^^^ custom element usign getCollection + attributes</p>
    `;
  }
}

customElements.define("app-side-nav", SideNav);
