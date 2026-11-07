import styles from "./social-tray.module.css";
import discordIcon from "../../assets/discord.svg?type=text";
import githubIcon from "../../assets/github.svg?type=text";
import twitterIcon from "../../assets/twitter-logo.svg?type=text";
import blueskyIcon from "../../assets/bluesky.svg?type=text";

export default class SocialTray extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <ul class="${styles.socialTray}">
        <li class="${styles.socialIcon}">
          <a href="https://github.com/ProjectEvergreen/greenwood" title="GitHub" target="_blank">
            ${githubIcon}
            <span class="no-show-screen-reader"> (opens in a new window)</span>
          </a>
        </li>

        <li class="${styles.socialIcon}">
          <a href="/discord/" title="Discord" target="_blank">
            ${discordIcon}
            <span class="no-show-screen-reader"> (opens in a new window)</span>
          </a>
        </li>
		
        <li class="${styles.socialIcon}">
          <a href="https://bsky.app/profile/projectevergreen.bsky.social" title="BlueSky" target="_blank">
            ${blueskyIcon}
            <span class="no-show-screen-reader"> (opens in a new window)</span>
          </a>
        </li>

        <li class="${styles.socialIcon}">
          <a href="https://twitter.com/PrjEvergreen" title="Twitter" target="_blank">
            ${twitterIcon}
            <span class="no-show-screen-reader"> (opens in a new window)</span>
          </a>
        </li>
      </ul>
    `;
  }
}

customElements.define("app-social-tray", SocialTray);
