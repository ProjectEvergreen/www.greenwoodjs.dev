import "./table-of-contents.js";
import pages from "../../stories/mocks/graph.json";

export default {
  title: "Components/Table of Contents",
  parameters: {
    fetchMock: {
      mocks: [
        {
          matcher: {
            url: "http://localhost:1984/___graph.json",
            response: {
              body: pages,
            },
          },
        },
      ],
    },
  },
};

const Template = () => "<app-toc route='/guides/getting-started/'></app-toc>";

export const Primary = Template.bind({});
