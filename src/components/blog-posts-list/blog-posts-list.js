import { getCollection, getCollectionByRoute } from "@greenwood/cli/src/data/queries.js";

export default class BlogPostsList extends HTMLElement {
  async connectedCallback() {
    const posts = (await getCollectionByRoute('/blog')).filter(page => page.label !== 'Index');
    console.log('NAV', await getCollection('nav'));
    console.log('BlogPostList', { posts });

    this.innerHTML = `
      <script type="application/json">
        ${JSON.stringify(posts)}
      </script>
      <h3>All Posts</h3>
      <ol>
        ${posts.map((post) => {
          const { title, route } = post;

          return `
            <li>
              <a href="${route}">${title}</a>
            </li>
          `;
        }).join('')}
      </ol>
      <p>(^^^ Custom Element  using CSR + getCollection w/ prerender)</p>
    `;
  }
}

customElements.define('app-blog-posts-list', BlogPostsList);