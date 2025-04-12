import platforms from "./platforms.json" with { type: "json" };
import githubLogo from "../../assets/github.svg?type=raw";
import netlifyLogo from "../../assets/netlify.svg?type=raw";
import nodejsLogo from "../../assets/nodejs.svg?type=raw";
import vercelLogo from "../../assets/vercel.svg?type=raw";
import styles from "./run-anywhere.module.css";

const platformImageMapper = {
  github: githubLogo,
  netlify: netlifyLogo,
  nodejs: nodejsLogo,
  vercel: vercelLogo,
};

export default class RunAnywhere extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="${styles.container}">
        <h3 class="${styles.heading}">Run anywhere the web can run</h3>
        <p class="${styles.subHeading}">Greenwood helps you take your application <a href="/guides/hosting/">to production</a> by embracing platforms that embrace web standards.</p>

        <div class="${styles.platformsContainer}">
          ${platforms
            .map((platform) => {
              const { label, icon, link } = platform;

              return `
                <div class="${styles.platformBox}">
                  <div class="${styles.iconBox}">
                    ${platformImageMapper[icon]}
                  </div>

                  <a class="${styles.iconLink}" href="${link}">${label}</a>
                </div>
              `;
            })
            .join("")}
        </div>
      </div>
    `;
  }
}

customElements.define("app-run-anywhere", RunAnywhere);
