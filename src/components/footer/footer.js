import discordIcon from "../../assets/discord.svg?type=raw";
import githubIcon from "../../assets/github.svg?type=raw";
import twitterIcon from "../../assets/twitter-logo.svg?type=raw";
import styles from "./footer.module.css";
import greenwoodLogo from "../../assets/greenwood-logo-full.svg?type=raw";

export default class Footer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="${styles.footer}">
        <div class="${styles.logo}">
          ${greenwoodLogo}
        </div>
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
      </footer>
    `;
  }
}

customElements.define("app-footer", Footer);
