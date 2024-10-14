import styles from './edit-on-github.module.css';

const REPO_PREFIX = 'https://github.com/ProjectEvergreen/www.greenwoodjs.dev/tree/main/www/pages/';

function convertRouteToSubLink(route) {
  if (route === "/") return "index.md"; // root of diretory === index
  
  // trim leading slash
  route = (route.charAt(0) === "/") 
  ? route.substr(1)
  : route;
  
  // append 'index.md' when necessary
  return (route.substr(-3) !== '.md')
    ? (route.charAt(route.length-1) === "/")
      ? `${route}index.md`
      : `${route}/index.md`
    : route;
}

export default class EditOnGitHub extends HTMLElement {
  connectedCallback() {
    const route = this.getAttribute('route');
    const subLink = convertRouteToSubLink(route);

    this.innerHTML = `
      <div class="${styles.container}">
        <a title="Edit on GitHub" href="${REPO_PREFIX}${subLink}" target="_blank">
          Edit on GitHub
        </a>
      </div>
    `
  }
}

customElements.define("app-edit-on-github", EditOnGitHub);