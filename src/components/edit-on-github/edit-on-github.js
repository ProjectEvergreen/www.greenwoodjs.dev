import styles from "./edit-on-github.module.css";

const REPO_PREFIX = "https://github.com/ProjectEvergreen/www.greenwoodjs.dev/edit/main/src/pages";
const MAX_ROUTE_DEPTH = 5;

// one / two segments - /guides/ -> /guides/index.md
// three (max) segments - /guides/getting-started/key-concepts/ -> /guides/getting-started/key-concepts.md
function convertRouteToEditLink(route) {
  const segments = route.split("/");

  // https://stackoverflow.com/a/5497365/417806
  return segments.length === MAX_ROUTE_DEPTH
    ? `${route.replace(/\/([^/]*)$/, "")}.md`
    : `${route}index.md`;
}

export default class EditOnGitHub extends HTMLElement {
  connectedCallback() {
    const label = "Edit on GitHub";
    const route = this.getAttribute("route");
    const href = `${REPO_PREFIX}${convertRouteToEditLink(route)}`;

    this.innerHTML = `
      <div class="${styles.container}">
        <a title="${label}" href="${href}" target="_blank">
          ${label}
        </a>
      </div>
    `;
  }
}

customElements.define("app-edit-on-github", EditOnGitHub);
