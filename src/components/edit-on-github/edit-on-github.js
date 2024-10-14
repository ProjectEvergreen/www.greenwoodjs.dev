import styles from "./edit-on-github.module.css";

const REPO_PREFIX = "https://github.com/ProjectEvergreen/www.greenwoodjs.dev/edit/main/src/pages/";

function convertRouteToSubLink(route) {
  if (route === "/") return "index.md"; // root of diretory === index

  const DIRS = ["guides", "ecosystem", "getting-started", "hosting", "tutorials"];

  const routeParts = route.split("/").filter((param) => param !== "");
  const trimmedRoute = routeParts.join("/");
  const isDirectory = DIRS.includes(routeParts[routeParts.length - 1]);

  return isDirectory ? `${trimmedRoute}/index.md` : `${trimmedRoute}.md`;
}

export default class EditOnGitHub extends HTMLElement {
  connectedCallback() {
    // protect against strigified "undefined"; occurs when the prop value is undefined in JS, but a string in HTML
    const label =
      this.hasAttribute("label") && this.getAttribute("label") !== "undefined"
        ? this.getAttribute("label")
        : "Edit on GitHub";
    const route = this.getAttribute("route");
    const href = `${REPO_PREFIX}${convertRouteToSubLink(route)}`;

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
