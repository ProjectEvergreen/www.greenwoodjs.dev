export default class Player extends HTMLElement {
  constructor() {
    super();

    this.title = "";
    this.playlist = [];
  }

  async connectedCallback() {
    this.playlist = JSON.parse(this.getAttribute("playlist") || "[]");
    this.title = this.getAttribute("name") || "";

    if (!this.shadowRoot) {
      this.playlist = JSON.parse(this.getAttribute("playlist") || "[]");
      this.title = this.getAttribute("name") || "";
      const list = this.playlist.map((item) => `<li>${item.title}</li>`).join("\n");
      const template = document.createElement("template");

      template.innerHTML = `
        <div style="text-align: left; width: 30%; margin:0 auto;">
          <h1>${this.title}</h1>
          <ul>
            ${list}
          </ul>
          <button>Start Playlist</button>
        </div>
      `;

      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    this.shadowRoot
      .querySelector("button")
      ?.addEventListener("click", this.startPlaylist.bind(this));
  }

  startPlaylist() {
    const { title, playlist } = this;
    console.log("starting playlist =>", { title, playlist });
    alert(`starting playlist => ${title}`);
  }
}

customElements.define("app-player", Player);
