import styles from "./latest-post.module.css";

export default class LatestPost extends HTMLElement {
  connectedCallback() {
    const link = this.getAttribute("link");
    const title = this.getAttribute("title");
    const icon = this.getAttribute("icon") ?? "🎉";

    this.innerHTML = `
      <div class="${styles.pill}">
        <span class="${styles.new}">${icon} New</span>
        <a class="${styles.link}" href="${link}" title="Read our latest post">${title} &#8594</a>
      </div>
    `;
  }
}

customElements.define("app-latest-post", LatestPost);
