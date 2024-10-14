import { expect } from "@esm-bundle/chai";
import "./edit-on-github.js";
import graph from "../../stories/mocks/graph.json" with { type: "json" };

// https://stackoverflow.com/questions/45425169/intercept-fetch-api-requests-and-responses-in-javascript
window.fetch = function () {
  return new Promise((resolve) => {
    resolve(new Response(JSON.stringify(graph)));
  });
};

// attributes
const ROUTE = "/" 

describe("Components/Edit on GitHub", () => {
  let editWrapper;
  let editLink;

  before(async () => {
    editWrapper = document.createElement("app-edit-on-github");
    editWrapper.setAttribute("route", ROUTE);

    document.body.appendChild(editWrapper);
    
    await editWrapper.updateComplete;

    editLink = editWrapper.querySelector("a")
  });

  it("should not be undefined", () => {
    expect(editWrapper).not.equal(undefined);
  });

  describe("Anchor tag to GitHub", () => {
    it("should render an anchor tag targeting a new window", () => {
      expect(editLink).not.equal(undefined);
      expect(editLink.getAttribute("target")).equal("_blank");
    });

    it("should include a title attribute with the label 'Edit on GitHub'", () => {
      expect(editLink.getAttribute("title")).equal("Edit on GitHub");
    });

    it("should render the text 'Edit on GitHub'", () => {
      // use trim due to allow backtick use
      expect(editLink.text.trim()).equal("Edit on GitHub");
    });

    describe("when the route is ONLY a leading slash", () => {
      it("should default to 'index.md'", () => {
        const expected = "https://github.com/ProjectEvergreen/www.greenwoodjs.dev/tree/main/www/pages/index.md"

        expect(editLink.getAttribute("href")).equal(expected);
      });
    });

    describe("when the route DOES NOT contain a markdown file", () => {
      let missingFilenamePath;

      before(async () => {
        missingFilenamePath = 'some/path/without/'; // ie: "guides/getting-started/"

        editWrapper = document.createElement("app-edit-on-github");
        editWrapper.setAttribute("route", missingFilenamePath);
    
        document.body.appendChild(editWrapper);
        
        await editWrapper.updateComplete;
    
        editLink = editWrapper.querySelector("a")
      });

      it("should include a href attribute which includes the index.md filepath", () => {
        const expected = "https://github.com/ProjectEvergreen/www.greenwoodjs.dev/tree/main/www/pages/some/path/without/index.md"

        expect(editLink.getAttribute("href")).equal(expected);
      });
    })

    describe("when the route DOES NOT have a leading slash", () => {
      let missingTrailingPath;

      before(async () => {
        missingTrailingPath = 'some/path/without/leading.md'; // ie: "guides/getting-started/going-further.md"

        editWrapper = document.createElement("app-edit-on-github");
        editWrapper.setAttribute("route", missingTrailingPath);
    
        document.body.appendChild(editWrapper);
        
        await editWrapper.updateComplete;
    
        editLink = editWrapper.querySelector("a")
      });

      it("should include a href attribute which includes the provided route", () => {
        const expected = "https://github.com/ProjectEvergreen/www.greenwoodjs.dev/tree/main/www/pages/some/path/without/leading.md"

        expect(editLink.getAttribute("href")).equal(expected);
      });
    });

    describe("when the route DOES have a trailing slash", () => {
      let includingTrailingPath;

      before(async () => {
        includingTrailingPath = '/some/path/without/leading.md'; // ie: "/guides/getting-started/going-further.md"

        editWrapper = document.createElement("app-edit-on-github");
        editWrapper.setAttribute("route", includingTrailingPath);
    
        document.body.appendChild(editWrapper);
        
        await editWrapper.updateComplete;
    
        editLink = editWrapper.querySelector("a")
      });

      it("should include a title attribute with the label 'Edit on GitHub'", () => {
        const expected = "https://github.com/ProjectEvergreen/www.greenwoodjs.dev/tree/main/www/pages/some/path/without/leading.md"

        expect(editLink.getAttribute("href")).equal(expected);
      });
    });
  });
});