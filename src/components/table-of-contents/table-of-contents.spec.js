import { expect } from "@esm-bundle/chai";
import "./table-of-contents.js";
import graph from "../../stories/mocks/graph.json" with { type: "json" };

// https://stackoverflow.com/questions/45425169/intercept-fetch-api-requests-and-responses-in-javascript
window.fetch = function () {
  return new Promise((resolve) => {
    resolve(new Response(JSON.stringify(graph)));
  });
};

// attributes
const ROUTE = "/guides/getting-started/key-concepts/";

describe("Components/Table of Contents", () => {
  const HEADING = "On This Page";
  let toc;
  let expectedTocPage = [];
  let expectedHeadingsContent = [];

  before(async () => {
    expectedTocPage = graph.find((page) => page.route === ROUTE);

    toc = document.createElement("app-toc");
    toc.setAttribute("route", ROUTE);

    document.body.appendChild(toc);
    await toc.updateComplete;
  });

  describe("Default Behavior - Full Menu", () => {
    let fullMenu;

    before(async () => {
      fullMenu = toc.querySelector("[role='full-menu']");
    });

    it("should not be null", () => {
      expect(fullMenu).not.equal(undefined);
    });

    it("should have the expected heading text", () => {
      const heading = fullMenu.querySelectorAll("[role='heading']");

      expect(heading.length).to.equal(1);
      expect(heading[0].textContent).to.equal(HEADING);
    });

    it("should have the expected number of ToC links in an ordered list", () => {
      const links = fullMenu.querySelectorAll("ol li a");
      const table = expectedTocPage.data.tableOfContents;

      expect(links.length).to.equal(table.length);

      links.forEach((link, i) => {
        const tocItem = expectedTocPage.data.tableOfContents[i];
        const { slug, content } = tocItem;

        expect(link.getAttribute("href")).to.equal(`#${slug}`);
        expect(link.textContent).to.equal(content);
      });
    });

    after(() => {
      fullMenu = null;
    });
  });

  describe("Default Behavior - Compact Menu", () => {
    let compactMenu;
    let popoverSelector = "onthispage";

    before(async () => {
      compactMenu = toc.querySelector("[role='compact-menu']");
    });

    it("should not be null", () => {
      expect(compactMenu).not.equal(undefined);
    });

    it("should have the expected popover trigger element", () => {
      const trigger = compactMenu.querySelectorAll(`[popovertarget="${popoverSelector}"]`);

      expect(trigger.length).to.equal(1);
      expect(trigger[0].textContent).to.contain(HEADING);
    });

    it("should have the expected popover element", () => {
      const popover = compactMenu.querySelectorAll(`#${popoverSelector}[popover]`);

      expect(popover.length).to.equal(1);
    });

    it("should have the expected number of section heading links", () => {
      const links = compactMenu.querySelectorAll("[role='heading'] a");

      expect(links.length).to.equal(expectedHeadingsContent.length);
    });

    it("should have the expected number of ToC links in an ordered list", () => {
      const links = compactMenu.querySelectorAll("ol li a");
      const table = expectedTocPage.data.tableOfContents;

      expect(links.length).to.equal(table.length);

      links.forEach((link, i) => {
        const tocItem = expectedTocPage.data.tableOfContents[i];
        const { slug, content } = tocItem;

        expect(link.getAttribute("href")).to.equal(`#${slug}`);
        expect(link.textContent).to.equal(content);
      });
    });

    after(() => {
      compactMenu = null;
    });
  });

  after(() => {
    toc.remove();
    toc = null;
  });
});
