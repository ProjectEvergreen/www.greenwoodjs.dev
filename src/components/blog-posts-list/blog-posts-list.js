import { getContentByRoute } from "@greenwood/cli/src/data/queries.js";
import styles from "./blog-posts-list.module.css";

export default class BlogPostsList extends HTMLElement {
  async connectedCallback() {
    const posts = (await getContentByRoute("/blog")).filter((page) => page.label !== "Blog");
    console.log({ styles });
    console.log("BlogPostList", { posts });

    this.innerHTML = `
      <ul class="${styles.postsList}">
        ${posts
          .map((post) => {
            const { title, route } = post;
            // const { coverImage } = post.data;
            // const previewImage = !coverImage ? '' : `
            //   <img src="${coverImage}" alt="${title}"/>
            // `;
            // ${previewImage}
            // console.log({ coverImage, previewImage })
            return `
              <li class="${styles.postsListItem}">
                <a href="${route}">${title}</a>
              </li>
            `;
          })
          .join("")}
      </ul>
    `;
  }
}

customElements.define("app-blog-posts-list", BlogPostsList);
