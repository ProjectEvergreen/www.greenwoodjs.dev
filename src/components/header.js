export default class Header extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header>
        <a href="/">
          <img src="https://www.greenwoodjs.io/assets/greenwood-logo-1500w.webp">
        </a>

        <nav>
          <ul>
            <li><a href="/docs/introduction/">Docs</a></li>
            <li><a href="/guides/">Guides</a></li>
            <li><a href="/blog/">Blog</a></li>
          </ul>
        </nav>
      </header>
    `;
  }
}