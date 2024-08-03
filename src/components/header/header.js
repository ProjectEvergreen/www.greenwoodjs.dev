import sheet from "./header.css" with { type: "css" };
import discordIcon from "../../assets/discord.svg?type=raw";
import githubIcon from "../../assets/github.svg?type=raw";
import twitterIcon from "../../assets/twitter-logo.svg?type=raw";
import mobileMenuIcon from "../../assets/tile.svg?type=raw";
import greenwoodLogo from "../../assets/greenwood-logo.svg?type=raw";

export default class Header extends HTMLElement {
  constructor() {
    super();
    this.isMobileMenuActive = false;
  }

  connectedCallback() {
    if (!this.shadowRoot) {
      const nav = JSON.parse(this.getAttribute("nav") || "[]").sort((a, b) =>
        a.data.order > b.data.order ? 1 : -1,
      );
      console.log('HEADER NAV', { nav });
      const template = document.createElement('template');

      template.innerHTML = `
        <header>
          <div class="logo-bar">
            <a href="/">
              ${greenwoodLogo}
            </a>
          </div>

          <nav class="nav-bar">
            <p style="text-align:right">(Custom Element using using active frontmatter from a layout.html =>)</p>
            <ul class="nav-bar-menu">
              ${nav
                .map((item) => {
                  const { title, route } = item;
                  return `
                    <li class="nav-bar-menu-item">
                      <a href="${route}" title="${title} Page">${title}</a>
                    </li>
                  `;
                })
                .join("\n")}
            </ul>

            <div class="social-tray">
              <li class="social-icon">
                <a href="https://github.com/ProjectEvergreen/greenwood" title="GitHub">
                  ${githubIcon}
                </a>
              </li>

              <li class="social-icon">
                <a href="https://discord.gg/bsy9jvWh" title="Discord">
                  ${discordIcon}
                </a>
              </li>

              <li class="social-icon">
                <a href="https://twitter.com/PrjEvergreen" title="Twitter">
                  ${twitterIcon}
                </a>
              </li>
            </div>

            <div class="mobile-menu">
              ${mobileMenuIcon}
            </div>
            
            <nav class="nav-bar-mobile">
              <ul class="mobile-menu-items">
              ${nav
                .map((item) => {
                  const { label, route, title } = item;
                  return `
                    <li class="nav-bar-menu-item">
                      <a href="${route}" title="${title}">${label}</a>
                    </li>
                  `;
                })
                .join("\n")}
              </ul>
            </nav>
          </nav>
        </header>

        <!-- Mobile menu Overlay -->
        <div class="overlay"></div>

        <!-- Close button -->
        <button class="close-button">&times;</button>
      `;

      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    this.shadowRoot.adoptedStyleSheets = [sheet];

    this.mobileMenu = this.shadowRoot?.querySelector(".mobile-menu");
    this.mobileMenuItems = this.shadowRoot?.querySelector(".mobile-menu-items");
    this.overlay = this.shadowRoot?.querySelector(".overlay");
    this.closeButton = this.shadowRoot?.querySelector(".close-button");
    this.socialTray = this.shadowRoot?.querySelector(".social-tray");

    this.mobileMenu?.addEventListener("click", this.toggleMobileMenu.bind(this));
    this.closeButton?.addEventListener("click", this.toggleMobileMenu.bind(this));
    globalThis.addEventListener("resize", this.resizeMobileMenu.bind(this));

    this.toggleMobileMenu();
    this.resizeMobileMenu();
  }

  toggleMobileMenu() {
    if (
      this.mobileMenuItems &&
      this.overlay &&
      this.closeButton &&
      this.mobileMenu &&
      this.socialTray
    ) {
      this.isMobileMenuActive = !this.isMobileMenuActive;
      this.mobileMenuItems.classList.toggle("active", this.isMobileMenuActive);
      this.overlay.classList.toggle("active", this.isMobileMenuActive);
      this.closeButton.style.display = this.isMobileMenuActive ? "block" : "none";
      this.mobileMenu.style.display = this.isMobileMenuActive ? "none" : "block";
      this.socialTray.style.display = this.isMobileMenuActive ? "none" : "flex";
    }
  }

  resizeMobileMenu() {
    if (this.mobileMenu && this.socialTray) {
      const isMobileView = globalThis?.innerWidth < 600;

      if (isMobileView) {
        this.mobileMenu.style.display = this.isMobileMenuActive ? "none" : "block";
        this.socialTray.style.display = this.isMobileMenuActive ? "none" : "flex";
      } else {
        if (this.isMobileMenuActive) {
          this.toggleMobileMenu();
        }
        this.mobileMenu.style.display = "none";
        this.socialTray.style.display = "flex";
      }
    }
  }
}

customElements.define("app-header", Header);
