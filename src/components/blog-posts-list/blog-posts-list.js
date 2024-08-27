import { getContentByRoute } from "@greenwood/cli/src/data/queries.js";
import styles from "./blog-posts-list.module.css";

export default class BlogPostsList extends HTMLElement {
  async connectedCallback() {
    const posts = (await getContentByRoute("/blog")).filter((page) => page.label !== "Blog");

    this.innerHTML = `
      <ul class="${styles.postsList}">
        ${posts
          .map((post) => {
            const { title, route } = post;
            const { coverImage, abstract = "" } = post.data;
            const coverBackground = coverImage ? coverImage : "/assets/greenwood-logo-leaf.svg";
            const coverBackgroundPadding = coverImage ? "4px" : "14px";

            return `
              <li class="${styles.postsListItem}">
                <img class="${styles.postsListItemCoverImage}" src="${coverBackground}" style="padding-left: ${coverBackgroundPadding}"/>

                <div class="${styles.postsListItemContentContainer}">
                  <h2 class="${styles.postsListItemContentTitle}">
                    <a class="${styles.postsListItemContentLink}" href="${route}">${title}</a>
                  </h2>
                  <p class="${styles.postsListItemContentAbstract}">${abstract}</p>
                </div>

              </li>
            `;
          })
          .join("")}
      </ul>
    `;
  }
}

customElements.define("app-blog-posts-list", BlogPostsList);
