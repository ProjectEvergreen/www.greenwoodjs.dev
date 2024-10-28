import { expect } from "@esm-bundle/chai";
import "./header.js";
import pages from "../../stories/mocks/graph.json" with { type: "json" };

const ICONS = [
  {
    link: "https://github.com/ProjectEvergreen/greenwood",
    title: "GitHub",
  },
  {
    link: "https://discord.gg/bsy9jvWh",
    title: "Discord",
  },
  {
    link: "https://twitter.com/PrjEvergreen",
    title: "Twitter",
  },
];

window.fetch = function () {
  return new Promise((resolve) => {
    resolve(new Response(JSON.stringify(pages)));
  });
};

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
      expect(header.querySelectorAll("header").length).equal(1);
    });

    it("should have an anchor tag with title attribute wrapping the logo", () => {
      const anchor = header.querySelector("a[title='Greenwood Home Page']");

      expect(anchor).to.not.equal(undefined);
      expect(anchor.getAttribute("href")).to.equal("/");
    });

    it("should have the Greenwood logo", () => {
      const logo = header.querySelectorAll("a[title='Greenwood Home Page'] svg");

      expect(logo.length).equal(1);
      expect(logo[0]).not.equal(undefined);
    });

    it("should have the expected desktop navigation links", () => {
      const links = header.querySelectorAll("nav[aria-label='Main'] ul li a");

      Array.from(links).forEach((link, idx) => {
        const navItem = pages.find((nav) => nav.route === link.getAttribute("href"));

        expect(navItem).to.not.equal(undefined);
        expect(navItem.data.order).to.equal((idx += 1));
        expect(link.textContent).to.equal(navItem.label);
        expect(link.getAttribute("title")).to.equal(navItem.title);
      });
    });

    it("should have the expected social link icons", () => {
      const links = header.querySelectorAll("nav[aria-label='Social'] ul li a");
      const icons = header.querySelectorAll("nav[aria-label='Social'] ul li a svg");

      expect(links.length).to.equal(3);
      expect(icons.length).to.equal(3);

      Array.from(links).forEach((link) => {
        const iconItem = ICONS.find((icon) => icon.title === link.getAttribute("title"));

        expect(iconItem).to.not.equal(undefined);
        expect(link.getAttribute("href")).to.equal(iconItem.link);
      });
    });
  });

  describe("Mobile Menu", () => {
    const popoverTarget = "mobile-menu";

    it("should have the expected mobile menu icon button", () => {
      const mobileIconButton = header.querySelectorAll(
        "button[aria-label='Mobile Menu Icon Button']",
      );

      expect(mobileIconButton.length).to.equal(1);
      expect(mobileIconButton[0].getAttribute("popovertarget")).to.equal(popoverTarget);
    });

    it("should have the expected popover overlay container", () => {
      const overlay = header.querySelectorAll(`#${popoverTarget}`);

      expect(overlay.length).to.equal(1);
      expect(overlay[0].getAttribute("popover")).to.equal("manual");
    });

    it("should have the expected close button", () => {
      const mobileCloseButton = header.querySelectorAll(
        "button[aria-label='Mobile Menu Close Button']",
      );

      expect(mobileCloseButton.length).to.equal(1);
      expect(mobileCloseButton[0].getAttribute("popovertarget")).to.equal(popoverTarget);
      expect(mobileCloseButton[0].getAttribute("popovertargetaction")).to.equal("hide");
    });

    it("should have the expected navigation links", () => {
      const links = header.querySelectorAll("nav[aria-label='Mobile'] ul li a");

      Array.from(links).forEach((link, idx) => {
        const navItem = pages.find((nav) => nav.route === link.getAttribute("href"));

        expect(navItem).to.not.equal(undefined);
        expect(navItem.data.order).to.equal((idx += 1));
        expect(link.textContent).to.equal(navItem.label);
        expect(link.getAttribute("title")).to.equal(navItem.title);
      });
    });
  });

  after(() => {
    header.remove();
    header = null;
  });
});
