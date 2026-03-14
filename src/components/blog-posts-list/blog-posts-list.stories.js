import "./blog-posts-list.js";
import pages from "../../stories/mocks/graph.json" with { type: "json" };

const ROUTE = "/blog/";

const meta = {
  title: "Components/Blog Posts List",
  parameters: {
    fetchMock: {
      mocks: [
        {
          matcher: {
            url: "http://localhost:1984/___graph.json",
            response: {
              body: pages.filter((page) => page.route.startsWith(ROUTE)),
            },
          },
        },
      ],
    },
  },
};

export default meta;

export const Primary = () => "<app-blog-posts-list></app-blog-posts-list>";
