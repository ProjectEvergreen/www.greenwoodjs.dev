import { expect } from "@esm-bundle/chai";
import "./footer.js";

describe("Components/Footer", () => {
  let footer;

  before(async () => {
    footer = document.createElement("app-footer");
    document.body.appendChild(footer);

    await footer.updateComplete;
  });

  describe("Default Behavior", () => {
    it("should not be null", () => {
      expect(footer).not.equal(undefined);
      expect(footer.querySelectorAll("footer").length).equal(1);
    });

    it("should have the Greenwood logo", () => {
      const logo = footer.querySelectorAll("div > svg");

      expect(logo.length).equal(1);
      expect(logo[0]).not.equal(undefined);
    });

    it("should have the social tray component", () => {
      const tray = footer.querySelectorAll("app-social-tray");

      expect(tray.length).to.equal(1);
    });
  });

  after(() => {
    footer.remove();
    footer = null;
  });
});
