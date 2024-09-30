import { expect } from "@esm-bundle/chai";
import "./side-nav.js";
import graph from "../../stories/mocks/graph.json" with { type: "json" };

// https://stackoverflow.com/questions/45425169/intercept-fetch-api-requests-and-responses-in-javascript
window.fetch = function () {
  return new Promise((resolve) => {
    resolve(new Response(JSON.stringify(graph)));
  });
};

// attributes
const ROUTE = "/guides/";
const HEADING = "Guides";
const CURRENT_ROUTE = "/guides/getting-started/key-concepts/";

describe("Components/Side Nav", () => {
  let nav;
  let expectedGuidesContent = [];
  let expectedHeadingsContent = [];
  let expectedSectionsContent = [];

  before(async () => {
    expectedGuidesContent = graph.filter((page) => page.route.startsWith(ROUTE));
    expectedHeadingsContent = expectedGuidesContent.filter(
      (page) => page.route.split("/").filter((segment) => segment !== "").length === 2,
    );
    expectedSectionsContent = expectedGuidesContent.filter(
      (page) => page.route.split("/").filter((segment) => segment !== "").length > 2,
    );

    nav = document.createElement("app-side-nav");
    nav.setAttribute("route", ROUTE);
    nav.setAttribute("heading", HEADING);
    nav.setAttribute("current-route", CURRENT_ROUTE);

    document.body.appendChild(nav);
    await nav.updateComplete;
  });

  describe("Default Behavior - Full Menu", () => {
    let fullMenu;

    before(async () => {
      fullMenu = nav.querySelector("[data-full]");
    });

    it("should not be null", () => {
      expect(fullMenu).not.equal(undefined);
    });

    it("should have the expected number of section heading links", () => {
      const links = fullMenu.querySelectorAll("[role='heading'] a");

      expect(links.length).to.equal(expectedHeadingsContent.length);
    });

    it("should have the expected content for section headings links", () => {
      const links = fullMenu.querySelectorAll("[role='heading'] a");

      links.forEach((link) => {
        const pages = expectedHeadingsContent.filter(
          (page) => page.route === link.getAttribute("href"),
        );

        expect(pages.length).to.equal(1);
        expect(pages[0].label).to.equal(link.textContent);
      });
    });

    it("should have the expected number of section links", () => {
      const links = fullMenu.querySelectorAll("li a");

      expect(links.length).to.equal(expectedSectionsContent.length);
    });

    it("should have the expected content for section links", () => {
      const links = fullMenu.querySelectorAll("li a");

      links.forEach((link) => {
        const pages = expectedSectionsContent.filter(
          (page) => page.route === link.getAttribute("href"),
        );

        expect(pages.length).to.equal(1);
        expect(pages[0].label).to.equal(link.textContent);
      });
    });

    after(() => {
      fullMenu = null;
    });
  });

  describe("Default Behavior - Compact Menu", () => {
    let compactMenu;
    let popoverSelector = "compact-menu";

    before(async () => {
      compactMenu = nav.querySelector("[data-compact]");
    });

    it("should not be null", () => {
      expect(compactMenu).not.equal(undefined);
    });

    it("should have the expected popover trigger element", () => {
      const trigger = compactMenu.querySelectorAll(
        `[popovertarget="${popoverSelector}"]:not([popovertargetaction])`,
      );

      expect(trigger.length).to.equal(1);
      expect(trigger[0].textContent).to.contain(HEADING);
    });

    it("should have the expected popover element", () => {
      const popover = compactMenu.querySelectorAll(`#${popoverSelector}[popover="manual"]`);

      expect(popover.length).to.equal(1);
    });

    it("should have the expected popover close button", () => {
      const closeButton = compactMenu.querySelectorAll(
        `[popover="manual"] [popovertarget="${popoverSelector}"]`,
      );

      expect(closeButton.length).to.equal(1);
    });

    it("should have the expected number of section heading links", () => {
      const links = compactMenu.querySelectorAll("[role='heading'] a");

      expect(links.length).to.equal(expectedHeadingsContent.length);
    });

    it("should have the expected content for section headings links", () => {
      const links = compactMenu.querySelectorAll("[role='heading'] a");

      links.forEach((link) => {
        const pages = expectedHeadingsContent.filter(
          (page) => page.route === link.getAttribute("href"),
        );

        expect(pages.length).to.equal(1);
        expect(pages[0].label).to.equal(link.textContent);
      });
    });

    it("should have the expected number of section links", () => {
      const links = compactMenu.querySelectorAll("li a");

      expect(links.length).to.equal(expectedSectionsContent.length);
    });

    it("should have the expected content for section links", () => {
      const links = compactMenu.querySelectorAll("li a");

      links.forEach((link) => {
        const pages = expectedSectionsContent.filter(
          (page) => page.route === link.getAttribute("href"),
        );

        expect(pages.length).to.equal(1);
        expect(pages[0].label).to.equal(link.textContent);
      });
    });

    after(() => {
      compactMenu = null;
    });
  });

  after(() => {
    nav.remove();
    nav = null;
  });
});
