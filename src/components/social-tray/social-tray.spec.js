import { expect } from "@esm-bundle/chai";
import "./social-tray.js";

const ICONS = [
  {
    link: "https://github.com/ProjectEvergreen/greenwood",
    title: "GitHub",
  },
  {
    link: "/discord/",
    title: "Discord",
  },
  {
    link: "https://twitter.com/PrjEvergreen",
    title: "Twitter",
  },
];

describe("Components/Social Tray", () => {
  let tray;

  before(async () => {
    tray = document.createElement("app-social-tray");

    document.body.appendChild(tray);

    await tray.updateComplete;
  });

  describe("Default Behavior", () => {
    it("should not be null", () => {
      expect(tray).not.equal(undefined);
      expect(tray.querySelectorAll("ul").length).equal(1);
    });

    it("should have the expected social link icons", () => {
      const links = tray.querySelectorAll("ul li a");
      const icons = tray.querySelectorAll("ul li a svg");

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
    tray.remove();
    tray = null;
  });
});
