import sheet from "./header.css" with { type: "css" };
import discordIcon from "../../assets/discord.svg?type=raw";
import githubIcon from "../../assets/github.svg?type=raw";
import twitterIcon from "../../assets/twitter-logo.svg?type=raw";
import mobileMenuIcon from "../../assets/tile.svg?type=raw";
import greenwoodLogo from "../../assets/greenwood-logo-full.svg?type=raw";

export default class Header extends HTMLElement {
  constructor() {
    super();
    this.isMobileMenuActive = false;
  }

  connectedCallback() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
      this.shadowRoot.innerHTML = `
        <header>
          <div class="logo-bar">
            ${greenwoodLogo}
          </div>

          <nav class="nav-bar">
            <ul class="nav-bar-menu">
              <li class="nav-bar-menu-item">
                <a href="/docs/" title="Documentation">Docs</a>
              </li>
              <li class="nav-bar-menu-item">
                <a href="/guides/" title="Guides">Guides</a>
              </li>
              <li class="nav-bar-menu-item">
                <a href="/blog/" title="Blog">Blog</a>
              </li>
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
                <li class="nav-bar-menu-item">
                  <a href="/docs/" title="Documentation">Docs</a>
                </li>
                <li class="nav-bar-menu-item">
                  <a href="/guides/" title="Guides">Guides</a>
                </li>
                <li class="nav-bar-menu-item">
                  <a href="/blog/" title="Blog">Blog</a>
                </li>
              </ul>
            </nav>
          </nav>
        </header>

        <!-- Mobile menu Overlay -->
        <div class="overlay"></div>

        <!-- Close button -->
        <button class="close-button">&times;</button>
      `;
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
