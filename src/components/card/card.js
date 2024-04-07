// "mock" CSS Modules
const styles = {
  card: 'card'
}

export default class Card extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="${styles.card}">
        ${this.innerHTML}
      </div>
    `
  }
}

customElements.define('app-card', Card);