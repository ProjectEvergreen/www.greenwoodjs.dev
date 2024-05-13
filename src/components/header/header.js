import sheet from "./header.css" with { type: "css" };

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
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M11.999 0.399902C5.59419 0.399902 0.400024 5.59339 0.400024 12.0003C0.400024 17.1247 3.72347 21.4728 8.33299 23.0074C8.91336 23.1135 9.12486 22.7554 9.12486 22.4477C9.12486 22.1721 9.11489 21.4429 9.1092 20.4752C5.8826 21.1759 5.20182 18.9199 5.20182 18.9199C4.67414 17.5797 3.91361 17.2229 3.91361 17.2229C2.86039 16.5037 3.99336 16.5179 3.99336 16.5179C5.15767 16.5998 5.77009 17.7136 5.77009 17.7136C6.80479 19.486 8.48538 18.974 9.14623 18.6771C9.25162 17.9279 9.55142 17.4166 9.88255 17.1268C7.30683 16.8334 4.59866 15.8386 4.59866 11.3936C4.59866 10.1267 5.05086 9.09201 5.79288 8.28091C5.67324 7.98752 5.27517 6.80823 5.90682 5.21096C5.90682 5.21096 6.88027 4.89905 9.09637 6.39947C10.0214 6.1424 11.0141 6.01422 12.0004 6.00923C12.9859 6.01422 13.9779 6.1424 14.9044 6.39947C17.1191 4.89905 18.0911 5.21096 18.0911 5.21096C18.7242 6.80823 18.3261 7.98752 18.2072 8.28091C18.9506 9.09201 19.3993 10.1267 19.3993 11.3936C19.3993 15.85 16.6868 16.8306 14.1033 17.1175C14.5191 17.4757 14.8902 18.1836 14.8902 19.266C14.8902 20.8163 14.8759 22.0675 14.8759 22.4477C14.8759 22.7582 15.0853 23.1192 15.6735 23.006C20.2794 21.4686 23.6 17.124 23.6 12.0003C23.6 5.59339 18.4059 0.399902 11.999 0.399902Z" fill="#0E0F0C"/>
                  </svg> 
                </a>
              </li>

              <li class="social-icon">
                <a href="https://discord.gg/bsy9jvWh" title="Discord">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.3034 5.33716C17.9344 4.71103 16.4805 4.2547 14.9629 4C14.7719 4.32899 14.5596 4.77471 14.411 5.12492C12.7969 4.89144 11.1944 4.89144 9.60255 5.12492C9.45397 4.77471 9.2311 4.32899 9.05068 4C7.52251 4.2547 6.06861 4.71103 4.70915 5.33716C1.96053 9.39111 1.21766 13.3495 1.5891 17.2549C3.41443 18.5815 5.17612 19.388 6.90701 19.9187C7.33151 19.3456 7.71356 18.73 8.04255 18.0827C7.41641 17.8492 6.82211 17.5627 6.24904 17.2231C6.39762 17.117 6.5462 17.0003 6.68416 16.8835C10.1438 18.4648 13.8911 18.4648 17.3082 16.8835C17.4568 17.0003 17.5948 17.117 17.7434 17.2231C17.1703 17.5627 16.576 17.8492 15.9499 18.0827C16.2789 18.73 16.6609 19.3456 17.0854 19.9187C18.8152 19.388 20.5875 18.5815 22.4033 17.2549C22.8596 12.7341 21.6806 8.80747 19.3034 5.33716ZM8.5201 14.8459C7.48007 14.8459 6.63107 13.9014 6.63107 12.7447C6.63107 11.5879 7.45884 10.6434 8.5201 10.6434C9.57071 10.6434 10.4303 11.5879 10.4091 12.7447C10.4091 13.9014 9.57071 14.8459 8.5201 14.8459ZM15.4936 14.8459C14.4535 14.8459 13.6034 13.9014 13.6034 12.7447C13.6034 11.5879 14.4323 10.6434 15.4936 10.6434C16.5442 10.6434 17.4038 11.5879 17.3825 12.7447C17.3825 13.9014 16.5548 14.8459 15.4936 14.8459Z" fill="#0E0F0C"/>
                  </svg>
                </a>
              </li>

              <li class="social-icon">
                <a href="https://twitter.com/PrjEvergreen" title="Twitter">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.52396 6.77561L15.481 0H14.0695L8.89474 5.88196L4.76466 0H0L6.24687 8.89533L0 16H1.41143L6.87281 9.78701L11.2353 16H16L9.52396 6.77561ZM7.59017 8.97342L6.95627 8.08709L1.92041 1.04119H4.08866L8.15394 6.72961L8.78518 7.61594L14.0689 15.0096H11.9006L7.59017 8.97342Z" fill="#0E0F0C"/>
                  </svg> 
                </a>
              </li>
            </div>

            <div class="mobile-menu">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="12" fill="#C3DDBA"/>
                <path d="M15.9959 22H16.0049" stroke="#0E0F0C" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M21.9998 22H22.0088" stroke="#0E0F0C" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9.99981 22H10.0088" stroke="#0E0F0C" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M15.9959 16H16.0049" stroke="#0E0F0C" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M15.9998 10H16.0088" stroke="#0E0F0C" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M21.9998 16H22.0088" stroke="#0E0F0C" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M21.9998 10H22.0088" stroke="#0E0F0C" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9.99981 16H10.0088" stroke="#0E0F0C" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9.99981 10H10.0088" stroke="#0E0F0C" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
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
