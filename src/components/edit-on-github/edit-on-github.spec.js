import { expect } from "@esm-bundle/chai";
import "./edit-on-github.js";

// attributes
const ROUTE = "/";

describe("Components/Edit on GitHub", () => {
  let editWrapper;
  let editLink;

  before(async () => {
    editWrapper = document.createElement("app-edit-on-github");
    editWrapper.setAttribute("route", ROUTE);

    document.body.appendChild(editWrapper);

    await editWrapper.updateComplete;

    editLink = editWrapper.querySelector("a");
  });

  it("should not be undefined", () => {
    expect(editWrapper).not.equal(undefined);
  });

  describe("Anchor tag to GitHub", () => {
    const EXPECTED_BASE =
      "https://github.com/ProjectEvergreen/www.greenwoodjs.dev/edit/main/src/pages/"; // including trailing

    it("should render an anchor tag targeting a new window", () => {
      expect(editLink).not.equal(undefined);
      expect(editLink.getAttribute("target")).equal("_blank");
    });

    it("should include a title attribute with the label 'Edit on GitHub'", () => {
      expect(editLink.getAttribute("title")).equal("Edit on GitHub");
    });

    it("should render the text 'Edit on GitHub'", () => {
      // use trim to allow backtick use in code
      expect(editLink.text.trim()).equal("Edit on GitHub");
    });

    describe("when the route is ONLY a slash", () => {
      it("should return 'index.md' for root-level ('/')", () => {
        const expected = `${EXPECTED_BASE}index.md`;

        expect(editLink.getAttribute("href")).equal(expected);
      });
    });

    describe("when the route IS NOT a directory", () => {
      let staticFilepath;

      before(async () => {
        staticFilepath = "/some/static/filename/"; // ie: "/guides/hosting/netlify/"

        editWrapper = document.createElement("app-edit-on-github");
        editWrapper.setAttribute("route", staticFilepath);

        document.body.appendChild(editWrapper);

        await editWrapper.updateComplete;

        editLink = editWrapper.querySelector("a");
      });

      it("should include a href attribute which includes filepath.md", () => {
        const expected = `${EXPECTED_BASE}some/static/filename.md`;

        expect(editLink.getAttribute("href")).equal(expected);
      });
    });

    describe("when the route IS a directory", () => {
      let missingTrailingPath;

      before(async () => {
        missingTrailingPath = "/some/path/to/hosting/"; // ie: "/guides/hosting/"

        editWrapper = document.createElement("app-edit-on-github");
        editWrapper.setAttribute("route", missingTrailingPath);

        document.body.appendChild(editWrapper);

        await editWrapper.updateComplete;

        editLink = editWrapper.querySelector("a");
      });

      it("should include a href attribute which includes index.md", () => {
        const expected = `${EXPECTED_BASE}some/path/to/hosting/index.md`;

        expect(editLink.getAttribute("href")).equal(expected);
      });
    });
  });
});
