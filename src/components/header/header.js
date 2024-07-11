import discordIcon from "../../assets/discord.svg?type=raw";
import githubIcon from "../../assets/github.svg?type=raw";
import twitterIcon from "../../assets/twitter-logo.svg?type=raw";
import mobileMenuIcon from "../../assets/tile.svg?type=raw";
import greenwoodLogo from "../../assets/greenwood-logo-full.svg?type=raw";
import styles from "./header.module.css";

export default class Header extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header class="${styles.container}">
        <a href="/" title="Greenwood Home Page" class="${styles.logoLink}">
          ${greenwoodLogo}
        </a>

        <div class="${styles.navBar}">
          <nav role="navigation" aria-label="Main">
            <ul class="${styles.navBarMenu}">
              <li class="${styles.navBarMenuItem}">
                <a href="/docs/" title="Documentation">Docs</a>
              </li>
              <li class="${styles.navBarMenuItem}">
                <a href="/guides/" title="Guides">Guides</a>
              </li>
              <li class="${styles.navBarMenuItem}">
                <a href="/blog/" title="Blog">Blog</a>
              </li>
            </ul>
          </nav>

          <nav role="navigation" aria-label="Social">
            <ul class="${styles.socialTray}">
              <li class="${styles.socialIcon}">
                <a href="https://github.com/ProjectEvergreen/greenwood" title="GitHub">
                  ${githubIcon}
                </a>
              </li>

              <li class="${styles.socialIcon}">
                <a href="https://discord.gg/bsy9jvWh" title="Discord">
                  ${discordIcon}
                </a>
              </li>

              <li class="${styles.socialIcon}">
                <a href="https://twitter.com/PrjEvergreen" title="Twitter">
                  ${twitterIcon}
                </a>
              </li>
            </ul>
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
                <li class="${styles.mobileMenuItem}">
                  <a href="/docs/" title="Documentation">Docs</a>
                </li>
                <li class="${styles.mobileMenuItem}">
                  <a href="/guides/" title="Guides">Guides</a>
                </li>
                <li class="${styles.mobileMenuItem}">
                  <a href="/blog/" title="Blog">Blog</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
    `;
  }
}

customElements.define("app-header", Header);
