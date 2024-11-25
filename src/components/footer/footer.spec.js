import { expect } from "@esm-bundle/chai";
import "./footer.js";

const ICONS = [
  {
    link: "https://github.com/ProjectEvergreen/greenwood",
    title: "GitHub",
  },
  {
    link: "https://discord.gg/dmDmjFCKuH",
    title: "Discord",
  },
  {
    link: "https://twitter.com/PrjEvergreen",
    title: "Twitter",
  },
];

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

    it("should have the expected social link icons", () => {
      const links = footer.querySelectorAll("ul li a");
      const icons = footer.querySelectorAll("ul li a svg");

      expect(links.length).to.equal(3);
      expect(icons.length).to.equal(3);

      Array.from(links).forEach((link) => {
        const iconItem = ICONS.find((icon) => icon.title === link.getAttribute("title"));

        expect(iconItem).to.not.equal(undefined);
        expect(link.getAttribute("href")).to.equal(iconItem.link);
      });
    });
  });
  after(() => {
    footer.remove();
    footer = null;
  });
});
