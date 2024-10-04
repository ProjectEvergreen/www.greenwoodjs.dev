import { expect } from "@esm-bundle/chai";
import "./blog-posts-list.js";
import graph from "../../stories/mocks/graph.json" with { type: "json" };

// https://stackoverflow.com/questions/45425169/intercept-fetch-api-requests-and-responses-in-javascript
window.fetch = function () {
  return new Promise((resolve) => {
    resolve(new Response(JSON.stringify(graph)));
  });
};

describe("Components/Blog Posts List", () => {
  let list;
  let expectedBlogPosts = [];

  before(async () => {
    expectedBlogPosts = graph
      .filter((page) => page.data.published)
      .sort((a, b) =>
        new Date(a.data.published).getTime() > new Date(b.data.published).getTime() ? -1 : 1,
      );

    list = document.createElement("app-blog-posts-list");
    document.body.appendChild(list);

    await list.updateComplete;
  });

  describe("Default Behavior", () => {
    it("should not be null", () => {
      expect(list).not.equal(undefined);
      expect(list.querySelectorAll("ul").length).to.equal(1);
    });

    it("should have the expected number of blog post as <li> tags", () => {
      const items = list.querySelectorAll("ul li");

      expect(items.length).to.equal(expectedBlogPosts.length);
    });

    it("should have the expected number of blog post as <li> tags", () => {
      const items = list.querySelectorAll("ul li");

      expect(items.length).to.equal(expectedBlogPosts.length);
    });

    it("should have the expected number of anchor tags with the right content as data", () => {
      const anchors = list.querySelectorAll("ul li a[href]");

      expect(anchors.length).to.equal(expectedBlogPosts.length);

      anchors.forEach((anchor, i) =>
        expect(anchor.getAttribute("href")).to.equal(expectedBlogPosts[i].route),
      );
    });

    it("should have the expected number of image tags with the right content as data", () => {
      const images = list.querySelectorAll("ul li a img[alt]");

      expect(images.length).to.equal(expectedBlogPosts.length);

      images.forEach((image, i) => {
        const post = expectedBlogPosts[i];
        const src = post.data.coverImage ?? "/assets/greenwood-logo-leaf.svg";

        expect(image.getAttribute("src")).to.equal(src);
        expect(image.getAttribute("alt")).to.equal(post.title);
      });
    });

    it("should have the expected heading with the right content", () => {
      const headings = list.querySelectorAll("h2");

      expect(headings.length).to.equal(expectedBlogPosts.length);

      headings.forEach((heading, i) => {
        expect(heading.textContent).to.equal(expectedBlogPosts[i].title);
      });
    });

    it("should have the expected abstract with the right content", () => {
      const paragraphs = list.querySelectorAll("p");

      expect(paragraphs.length).to.equal(expectedBlogPosts.length);

      paragraphs.forEach((paragraph, i) => {
        expect(paragraph.textContent.replace(/\'/g, "&apos;")).to.equal(
          expectedBlogPosts[i].data.abstract,
        );
      });
    });
  });

  after(() => {
    list.remove();
    list = null;
  });
});
