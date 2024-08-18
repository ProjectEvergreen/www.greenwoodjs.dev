import platforms from "./platforms.json" with { type: "json" };
import styles from "./run-anywhere.module.css";

export default class RunAnywhere extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="${styles.container}">
        <h3 class="${styles.heading}">Run anywhere the web can run</h3>
        <p class="${styles.subHeading}">Greenwood helps you take your application <a href="/guides/deploy/">to production</a> by embracing platforms that embrace web standards.</p>

        <div class="${styles.platformsContainer}">
          ${platforms
            .map((platform) => {
              const { name, icon, link } = platform;

              return `
                <div class="${styles.platformBox}">
                  <div class="${styles.iconBox}">
                    <img class="${styles.icon}" src="${icon}" alt="${name} logo"/>
                  </div>

                  <a class="${styles.iconLink}" href="${link}">${name}</a>
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
