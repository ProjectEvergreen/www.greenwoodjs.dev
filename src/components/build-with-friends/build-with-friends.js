import styles from "./build-with-friends.module.css";

export default class BuildWithFriends extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="${styles.container}">
        <h3>Build With Friends</h3>
        <p>Greenwood Lorum Ipsum...</p>
        <img src="/assets/lit.svg" alt="Lit logo"/>
      </div>
    `;
  }
}

customElements.define("app-build-with-friends", BuildWithFriends);
