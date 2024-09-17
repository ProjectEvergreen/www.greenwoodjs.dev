import { getContentByRoute } from "@greenwood/cli/src/data/queries.js";
import styles from "./side-nav.module.css";

export default class SideNav extends HTMLElement {
  async connectedCallback() {
    const heading = this.getAttribute("heading") || "";
    const route = this.getAttribute("route");
    const currentRoute = this.getAttribute("current-route") || "";

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
        <div class="${styles.fullMenu}">
          ${sections
            .map((section) => {
              const { heading, items, link } = section;
              const isActiveHeading = currentRoute.startsWith(link) ? "active" : "";

              return `
                <h3 class="${styles.compactMenuSectionHeading}">
                  <a class="${isActiveHeading}" href="${link}">${heading}</a>
                </h3>
                <ul class="${styles.compactMenuSectionList}">
                  ${items
                    .map((item) => {
                      const { label, route } = item;
                      const isActive = route === currentRoute ? " active" : "";

                      return `
                        <li class="${styles.compactMenuSectionListItem}${isActive}">
                          <a href="${route}">${label}</a>
                        </li>
                      `;
                    })
                    .join("")}
                </ul>
              `;
            })
            .join("")}
        </div>
        <div class="${styles.compactMenu}">
          <button popovertarget="compact-menu" class="${styles.compactMenuPopoverTrigger}" aria-label="Compact Guides Menu">
            ${heading} &#9660;
          </button>
          <div id="compact-menu" class="${styles.compactMenuPopover}" popover>
            ${sections
              .map((section) => {
                const { heading, items, link } = section;
                const isActiveHeading = currentRoute.startsWith(link) ? "active" : "";

                return `
                  <h3 class="${styles.compactMenuSectionHeading}">
                    <a class="${isActiveHeading}" href="${link}">${heading}</a>
                  </h3>
                  <ul class="${styles.compactMenuSectionList}">
                    ${items
                      .map((item) => {
                        const { label, route } = item;
                        const isActive = route === currentRoute ? " active" : "";

                        return `
                          <li class="${styles.compactMenuSectionListItem}${isActive}">
                            <a href="${route}">${label}</a>
                          </li>
                        `;
                      })
                      .join("")}
                  </ul>
                `;
              })
              .join("")}
          </div>
        </div>
      `;
    }
  }
}

customElements.define("app-side-nav", SideNav);
