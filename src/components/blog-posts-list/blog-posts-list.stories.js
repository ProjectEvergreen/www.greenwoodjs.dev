import "./blog-posts-list.js";
import pages from "../../stories/mocks/graph.json";

export default {
  title: "Components/Blog Posts List",
  parameters: {
    fetchMock: {
      mocks: [
        {
          matcher: {
            url: "http://localhost:1985/graph.json",
            response: {
              body: pages,
            },
          },
        },
      ],
    },
  },
};

const Template = () => "<app-blog-posts-list></app-blog-posts-list>";

export const Primary = Template.bind({});
