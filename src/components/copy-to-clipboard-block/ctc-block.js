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
    this.snippetContents = "";
  }

  connectedCallback() {
    const variant = this.getAttribute("variant");
    const supportedScriptRunners = Object.keys(scriptRunnerLogoMapper);

    if (!this.shadowRoot && typeof window !== "undefined") {
      if (variant === "runners") {
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
          <div class="runner-container">
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
      } else if (variant === "snippet") {
        const heading = this.getAttribute("heading");
        const headingHtml = heading ? `<span class="heading">${heading}</span>` : "";

        this.snippetContents = this.textContent;
        template.innerHTML = `
          <div class="snippet-container">
            <div class="snippet">
              ${headingHtml}
              <span class="copy-icon">
                ${copyIcon}
              </span>
              ${this.innerHTML}
            </div>
          </div>
        `;
      }

      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));

      switch (variant) {
        case "runners":
          this.shadowRoot
            .querySelectorAll(".command-runner")
            .forEach((item) => item.addEventListener("click", this.selectCommandRunner.bind(this)));
          this.shadowRoot
            .querySelector(".copy-icon")
            .addEventListener("click", this.copyCommandToClipboard.bind(this));
          break;
        case "snippet":
          this.shadowRoot
            .querySelector(".copy-icon")
            .addEventListener("click", this.copySnippetToClipboard.bind(this));
          break;
      }

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

  copySnippetToClipboard() {
    const contents = this.snippetContents;

    navigator.clipboard.writeText(contents);
    console.log("copying the following contents to your clipboard =>", contents);
  }
}

customElements.define("app-ctc-block", CopyToClipboardBlock);
