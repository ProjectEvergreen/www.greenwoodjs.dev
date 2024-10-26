import theme from "../../styles/theme.css" with { type: "css" };
import sheet from "./ctc-block.css" with { type: "css" };
import npmLogo from "../../assets/npm.svg?type=raw";
import pnpmLogo from "../../assets/pnpm.svg?type=raw";
import yarnLogo from "../../assets/yarn.svg?type=raw";
import copyIcon from "../../assets/copy-button.svg?type=raw";

const template = document.createElement("template");

const scriptRunnerLogoMapper = {
  npm: npmLogo,
  yarn: yarnLogo,
  pnpm: pnpmLogo,
};

export default class CopyToClipboardBlock extends HTMLElement {
  constructor() {
    super();
    this.blockConfigs = [];
    this.selectCommandRunnerIdx = 0;
  }

  connectedCallback() {
    const variant = this.getAttribute("variant");
    const supportedScriptRunners = Object.keys(scriptRunnerLogoMapper);

    if (!this.shadowRoot && typeof window !== "undefined") {
      if (variant === "script") {
        const contents = document.createElement("template");
        contents.innerHTML = this.innerHTML;

        const nodes = Array.from(contents.content.childNodes).filter(
          (node) => node.nodeName !== "#text",
        );

        supportedScriptRunners.map((runner) => {
          nodes.forEach((node) => {
            if (node.textContent.startsWith(runner)) {
              this.blockConfigs.push({
                runner,
                html: node.outerHTML.replace(runner, `$ ${runner}`),
                pasteContents: node.textContent.trim(),
              });
            }
          });
        });

        template.innerHTML = `
          <div class="container">
            <ul>
              ${this.blockConfigs
                .map((config, idx) => {
                  const { runner } = config;
                  const isActive = idx === this.selectCommandRunnerIdx ? " active" : "";

                  return `
                  <li class="command-runner${isActive}" data-runner="${runner}">
                    ${scriptRunnerLogoMapper[runner]}
                  </li>
                `;
                })
                .join("")}
            </ul>
            <div class="snippet">
              ${this.blockConfigs[this.selectCommandRunnerIdx].html}
            </div>
            <span class="copy-icon">
              ${copyIcon}
            </span>
          </div>
        `;
      }

      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));

      this.shadowRoot
        .querySelectorAll(".command-runner")
        .forEach((item) => item.addEventListener("click", this.selectCommandRunner.bind(this)));
      this.shadowRoot
        .querySelector(".copy-icon")
        .addEventListener("click", this.copyCommandToClipboard.bind(this));

      this.shadowRoot.adoptedStyleSheets = [theme, sheet];
    }
  }

  selectCommandRunner(event) {
    const runners = this.shadowRoot.querySelectorAll(".command-runner");
    const selectedRunner = event.currentTarget.dataset.runner;
    const config = this.blockConfigs.find((config) => config.runner === selectedRunner);

    runners.forEach((runner, idx) => {
      runner.classList.remove("active");

      if (runner.dataset.runner === selectedRunner) {
        runner.classList.add("active");
        this.selectCommandRunnerIdx = idx;
      }
    });

    this.shadowRoot.querySelector(".snippet").innerHTML = config.html;
  }

  copyCommandToClipboard() {
    const selectedRunnerConfig = this.blockConfigs[this.selectCommandRunnerIdx];
    const contents = selectedRunnerConfig.pasteContents;

    navigator.clipboard.writeText(contents);
    console.log("copying the following contents to your clipboard =>", contents);
  }
}

customElements.define("app-ctc-block", CopyToClipboardBlock);
