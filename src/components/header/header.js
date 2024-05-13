import sheet from "./header.css" with { type: "css" };
import discordIcon from "../../assets/discord.svg?type=raw";
import githubIcon from "../../assets/github.svg?type=raw";
import twitterIcon from "../../assets/twitter-logo.svg?type=raw";
import mobileMenuIcon from "../../assets/tile.svg?type=raw";

export default class Header extends HTMLElement {
  connectedCallback() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
      this.shadowRoot.innerHTML = `
        <header>
          <div class="logo-bar">
            <img class="greenwood-logo" src="/assets/greenwood-logo.svg" alt="Logo">
          </div>

          <div class="nav-bar">
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
                  
          </div>
        </header>

        <!-- Mobile menu Overlay -->
        <div class="overlay"></div>

        <!-- Close button -->
        <button class="close-button">&times;</button>
      `;
    }

    this.shadowRoot.adoptedStyleSheets = [sheet];

    // Mobile menu toggle
    const mobileMenu = this.shadowRoot.querySelector(".mobile-menu");
    const mobileMenuItems = this.shadowRoot.querySelector(".mobile-menu-items");
    const overlay = this.shadowRoot.querySelector(".overlay");
    const closeButton = this.shadowRoot.querySelector(".close-button");
    const socialTray = this.shadowRoot.querySelector(".social-tray");
    const menuButton = this.shadowRoot.querySelector(".mobile-menu");

    mobileMenu?.addEventListener("click", function () {
      mobileMenuItems.classList.toggle("active");
      overlay.classList.toggle("active");
      closeButton.style.display = overlay.classList.contains("active") ? "block" : "none";
      socialTray.style.display = overlay.classList.contains("active") ? "none" : "flex";
      menuButton.style.display = overlay.classList.contains("active") ? "none" : "flex";
    });

    closeButton?.addEventListener("click", function () {
      mobileMenuItems.classList.remove("active");
      overlay.classList.remove("active");
      closeButton.style.display = "none";
      socialTray.style.display = "flex";
      menuButton.style.display = "";
      mobileMenuItems.style.display = "none";
    });
  }
}

customElements.define("app-header", Header);
