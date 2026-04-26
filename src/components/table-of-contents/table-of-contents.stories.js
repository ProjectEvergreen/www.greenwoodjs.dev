import "./table-of-contents.js";
import pages from "../../stories/mocks/graph.json" with { type: "json" };

const meta = {
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

export default meta;

export const Primary = () => `
  <app-toc route='/guides/getting-started/'></app-toc>
`;
