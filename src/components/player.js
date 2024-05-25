export default class Player extends HTMLElement {
  async connectedCallback() {
    console.log("conntected!");
    const playlist = JSON.parse(this.getAttribute("playlist") || "[]");
    const title = this.getAttribute("title") || "";
    const list = playlist
      .map((item) => {
        return `<li>${item.title}</li>`;
      })
      .join("\n");
    console.log({ playlist, title, list });

    this.innerHTML = `
      <h1>${title}</h1>
      <ul style="text-align: left; width: 30%; margin:0 auto;">
        ${list}
      </ul>
    `;
  }
}

customElements.define("app-player", Player);
