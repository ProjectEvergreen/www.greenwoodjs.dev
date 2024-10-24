import "./blog-posts-list.js";
import pages from "../../stories/mocks/graph.json";

const ROUTE = "/blog/";

export default {
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

const Template = () => "<app-blog-posts-list></app-blog-posts-list>";

export const Primary = Template.bind({});
