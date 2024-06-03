import styles from "./latest-post.module.css";

export default class LatestPost extends HTMLElement {
  connectedCallback() {
    const link = this.getAttribute("link");
    const title = this.getAttribute("title");

    this.innerHTML = `
      <div class="${styles.pill}">
        <span class="${styles.new}">🎉 New</span>
        <a href="${link}" title="Read our latest post">${title} &#8594</a>
      </div>
    `;
  }
}

customElements.define("app-latest-post", LatestPost);
