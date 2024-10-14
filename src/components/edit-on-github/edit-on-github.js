import styles from './edit-on-github.module.css';

const REPO_PREFIX = 'https://github.com/ProjectEvergreen/www.greenwoodjs.dev/blob/main/src/pages/';

function convertRouteToSubLink(route) {
  console.log('incoming route', route);
  if (route === "/") return "index.md"; // root of diretory === index

  const DIRS = [
    'guides',
    'ecosystem',
    'getting-started',
    'hosting',
    'tutorials',
  ];
  
  const routeParts = route.split('/').filter(param => param !== "");    
  const trimmedRoute = routeParts.join("/");
  const isDirectory = DIRS.includes(routeParts[routeParts.length-1]);
  
  return isDirectory
      ? `${trimmedRoute}/index.md` 
      : `${trimmedRoute}.md`;
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