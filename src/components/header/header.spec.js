import { expect } from "@esm-bundle/chai";
import "./header.js";

describe("Components/Header", () => {
  let header;

  before(async () => {
    header = document.createElement("app-header");
    document.body.appendChild(header);

    await header.updateComplete;
  });

  describe("Default Behavior", () => {
    it("should not be null", () => {
      expect(header).not.equal(undefined);
      expect(header.shadowRoot.querySelectorAll(".logo-bar").length).equal(1);
    });

    // TODO navigation item test
  });

  after(() => {
    header.remove();
    header = null;
  });
});
