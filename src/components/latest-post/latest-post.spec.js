import { expect } from "@esm-bundle/chai";
import "./latest-post.js";

describe("Components/Latest Post", () => {
  const LINK = "/test/";
  const TITLE = "test title";
  let latestPost;

  before(async () => {
    latestPost = document.createElement("app-latest-post");

    latestPost.setAttribute("link", LINK);
    latestPost.setAttribute("title", TITLE);

    document.body.appendChild(latestPost);

    await latestPost.updateComplete;
  });

  describe("Default Behavior", () => {
    it("should not be null", () => {
      expect(latestPost).not.equal(undefined);
      expect(latestPost.querySelectorAll("div").length).equal(1);
    });

    describe("Link tag", () => {
      let link;

      before(async () => {
        link = document.querySelector("a");
      });

      it("should have the expected href value", () => {
        expect(link.getAttribute("href")).to.equal(LINK);
      });

      it("should have the expected title attribute", () => {
        expect(link.getAttribute("title")).to.equal("Read our latest post");
      });

      it("should have the expected title text", () => {
        expect(link.textContent).to.equal(`${TITLE} →`);
      });
    });
  });

  after(() => {
    latestPost.remove();
    latestPost = null;
  });
});
