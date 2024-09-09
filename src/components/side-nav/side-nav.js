import { getContentByRoute } from "@greenwood/cli/src/data/queries.js";

export default class SideNav extends HTMLElement {
  async connectedCallback() {
    const heading = this.getAttribute("heading") || "";
    const route = this.getAttribute("route");

    // TODO on first render, even static attributes are undefined
    // ??? { route: undefined, heading: '' }
    // ??? { route: '/guides/', heading: 'Guides' }
    // { route: '/guides/', heading: 'Guides' }
    if (route && route !== "") {
      const content = (await getContentByRoute(route)).filter((page) => page.route !== route);
      const sections = [];

      content.forEach((item) => {
        const segments = item.route
          .replace(`${route}`, "")
          .split("/")
          .filter((segment) => segment !== "");
        const parent = content.find((page) => page.route === `${route}${segments[0]}/`);

        if (!sections[parent.data.order - 1]) {
          sections[parent.data.order - 1] = {
            link: parent.route,
            heading: parent.label, // TODO title not populating
            items: [],
          };
        }

        if (parent.route !== item.route) {
          sections[parent.data.order - 1].items[item.data.order - 1] = item;
        }
      });

      this.innerHTML = `
        <h2>${heading}</h2>
        ${sections
          .map((section) => {
            const { heading, items, link } = section;

            return `
              <h3>
                <a href="${link}">${heading}</a>
              </h3>
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
      `;
    }
  }
}

customElements.define("app-side-nav", SideNav);
