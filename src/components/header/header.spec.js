import { expect } from "@esm-bundle/chai";
import "./header.js";

describe("Components/Header", () => {
  const NAV = [
    {
      title: "Documentation",
      label: "Docs",
    },
    {
      title: "Guides",
      label: "Guides",
    },
    {
      title: "Blog",
      label: "Blog",
    },
  ];
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

  let header;

  before(async () => {
    header = document.createElement("app-header");
    document.body.appendChild(header);

    await header.updateComplete;
  });

  describe("Default Behavior", () => {
    it("should not be null", () => {
      expect(header).not.equal(undefined);
      expect(header.shadowRoot.querySelectorAll("header").length).equal(1);
    });

    it("should have the Greenwood logo", () => {
      const logo = header.shadowRoot.querySelectorAll(".logo-bar svg");

      expect(logo.length).equal(1);
      expect(logo[0]).not.equal(undefined);
    });

    it("should have an anchor tag wrapping the logo", () => {
      const anchor = header.shadowRoot.querySelector("header a");
      const logo = anchor.querySelector(".logo-bar svg");

      expect(anchor).to.not.equal(undefined);
      expect(anchor.getAttribute("href")).to.equal("/");
      expect(logo).to.not.equal(undefined);
    });

    it("should have the expected desktop navigation links", () => {
      const links = header.shadowRoot.querySelectorAll("nav ul:not(.mobile-menu-items) li a");

      Array.from(links).forEach((link) => {
        const navItem = NAV.find(
          (nav) => `/${nav.label.toLowerCase()}/` === link.getAttribute("href"),
        );

        expect(navItem).to.not.equal(undefined);
        expect(link.textContent).to.equal(navItem.label);
        expect(link.getAttribute("title")).to.equal(navItem.title);
      });
    });

    it("should have the expected social link icons", () => {
      const links = header.shadowRoot.querySelectorAll(".social-tray li a");
      const icons = header.shadowRoot.querySelectorAll(".social-tray li a svg");

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
    it("should have the expected mobile navigation links", () => {
      const links = header.shadowRoot.querySelectorAll("nav.nav-bar-mobile ul li a");

      Array.from(links).forEach((link) => {
        const navItem = NAV.find(
          (nav) => `/${nav.label.toLowerCase()}/` === link.getAttribute("href"),
        );

        expect(navItem).to.not.equal(undefined);
        expect(link.textContent).to.equal(navItem.label);
        expect(link.getAttribute("title")).to.equal(navItem.title);
      });
    });

    it("should have the expected overlay container", () => {
      const overlay = header.shadowRoot.querySelectorAll(".overlay");

      expect(overlay.length).to.equal(1);
    });

    it("should have the expected close button", () => {
      const button = header.shadowRoot.querySelectorAll("button");

      expect(button.length).to.equal(1);
    });
  });

  after(() => {
    header.remove();
    header = null;
  });
});
