import { expect } from "@esm-bundle/chai";
import "./heading-box.js";

describe("Components/Heading Box", () => {
  const HEADING = "Heading goes here";
  const CONTENT = "<p>Content goes here</p>";
  let headingBox;

  before(async () => {
    headingBox = document.createElement("app-heading-box");

    headingBox.setAttribute("heading", HEADING);
    headingBox.innerHTML = CONTENT;

    document.body.appendChild(headingBox);

    await headingBox.updateComplete;
  });

  describe("Default Behavior", () => {
    it("should not be null", () => {
      expect(headingBox).not.equal(undefined);
      expect(headingBox.querySelectorAll("div:not([role='details'])").length).equal(1);
    });

    it("should have the expected heading content set as an attribute", () => {
      const heading = headingBox.querySelectorAll("[role='heading']");

      expect(heading.length).to.equal(1);
      expect(heading[0].textContent).equal(HEADING);
    });

    it("should have the expected 'slotted' content", () => {
      const slotted = headingBox.querySelectorAll("[role='details']");

      expect(slotted.length).to.equal(1);
      expect(slotted[0].innerHTML.trim()).equal(CONTENT);
    });
  });

  after(() => {
    headingBox.remove();
    headingBox = null;
  });
});
