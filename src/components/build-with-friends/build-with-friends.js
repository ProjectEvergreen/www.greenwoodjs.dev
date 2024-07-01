import styles from "./build-with-friends.module.css";
import htmxIcon from "../../assets/htmx.svg?type=raw";
import litIcon from "../../assets/lit.svg?type=raw";
import storybookIcon from "../../assets/storybook.svg?type=raw";
import tailwindIcon from "../../assets/tailwind-logo.svg?type=raw";
import typescriptIcon from "../../assets/typescript.svg?type=raw";
import wccIcon from "../../assets/wcc.svg?type=raw";
import wtrIcon from "../../assets/modern-web.svg?type=raw";

export default class BuildWithFriends extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="${styles.container}">
        <h3 class="${styles.heading}">Build With Friends</h3>

        <p>Greenwood and Web Components work great with all of your favorite tools in the web ecosystem.</p>

        <span class="${styles.icons}">
          <span class="${styles.icon}">
            ${litIcon}
          </span>
          <span class="${styles.icon}">
            ${storybookIcon}
          </span>
          <span class="${styles.icon}">
            ${tailwindIcon}
          </span>
          <span class="${styles.icon}">
            ${typescriptIcon}
          </span>
          <span class="${styles.icon}">
            ${htmxIcon}
          </span>
          <span class="${styles.icon}">
            <span>${wtrIcon}</span>
            <span>Web Test Runner</span>
          </span>
          <span class="${styles.icon}">
            ${wccIcon}
          </span>
        </div>
      </div>
    `;
  }
}

customElements.define("app-build-with-friends", BuildWithFriends);
