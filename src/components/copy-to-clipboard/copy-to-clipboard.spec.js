import { expect } from "@esm-bundle/chai";
import "./copy-to-clipboard.js";

describe("Components/Copy To Clipboard", () => {
  const content = "npx @greenwood/init@latest my-app";
  let ctc;

  before(async () => {
    ctc = document.createElement("app-ctc");

    ctc.setAttribute("content", content);
    document.body.appendChild(ctc);

    await ctc.updateComplete;
  });

  describe("Default Behavior", () => {
    it("should not be null", () => {
      expect(ctc).not.equal(undefined);
    });

    it("should have an icon with the user provided content set", () => {
      const icon = ctc.shadowRoot.querySelectorAll("[title='Copy to clipboard']");

      expect(icon.length).to.equal(1);
    });
  });
  after(() => {
    ctc.remove();
    ctc = null;
  });
});
