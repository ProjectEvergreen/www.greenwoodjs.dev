import { getContentByCollection } from "@greenwood/cli/src/data/client.js";
import mobileMenuIcon from "../../assets/tile.svg?type=raw";
import greenwoodLogo from "../../assets/greenwood-logo-full.svg?type=raw";
import styles from "./header.module.css";
import "../social-tray/social-tray.js";

export default class Header extends HTMLElement {
  async connectedCallback() {
    const currentRoute = this.getAttribute("current-route") ?? "";
    const navItems = (await getContentByCollection("nav")).sort((a, b) =>
      a.data.order > b.data.order ? 1 : -1,
    );

    this.innerHTML = `
      <header class="${styles.container}">
        <a href="/" title="Greenwood Home Page" class="${styles.logoLink}">
          ${greenwoodLogo}
        </a>

        <div class="${styles.navBar}">
          <nav role="navigation" aria-label="Main">
            <ul class="${styles.navBarMenu}">
              ${navItems
                .map((item) => {
                  const { route, label } = item;
                  const isActiveClass = currentRoute.startsWith(item.route) ? 'class="active"' : "";

                  return `
                    <li class="${styles.navBarMenuItem}">
                      <a href="${route}" ${isActiveClass} title="${label}">${label}</a>
                    </li>
                  `;
                })
                .join("")}
            </ul>
          </nav>

          <nav role="navigation" aria-label="Social">
            <app-social-tray></app-social-tray>
          </nav>

          <button class="${styles.mobileMenuIcon}" popovertarget="mobile-menu" aria-label="Mobile Menu Icon Button">
            ${mobileMenuIcon}
          </button>
        </div>

        <div id="mobile-menu" popover="manual">
          <div class="${styles.mobileMenuBackdrop}">

            <button class="${styles.mobileMenuCloseButton}" popovertarget="mobile-menu" popovertargetaction="hide" aria-label="Mobile Menu Close Button">
              &times;
            </button>
            
            <nav role="navigation" aria-label="Mobile">
              <ul class="${styles.mobileMenuList}">
                ${navItems
                  .map((item) => {
                    const { route, label } = item;
                    const isActiveClass = currentRoute.startsWith(item.route)
                      ? 'class="active"'
                      : "";

                    return `
                      <li class="${styles.mobileMenuListItem}">
                        <a href="${route}" ${isActiveClass} title="${label}">${label}</a>
                      </li>
                    `;
                  })
                  .join("")}
              </ul>
            </nav>
          </div>
        </div>
      </header>
    `;
  }
}

customElements.define("app-header", Header);
