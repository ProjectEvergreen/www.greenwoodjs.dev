import "./header.js";
import pages from "../../stories/mocks/graph.json" with { type: "json" };

const meta = {
  title: "Components/Header",
  parameters: {
    fetchMock: {
      mocks: [
        {
          matcher: {
            url: "http://localhost:1984/___graph.json",
            response: {
              body: pages.filter((page) => page.data.collection === "nav"),
            },
          },
        },
      ],
    },
  },
};

export default meta;

export const Primary = () => `
  <app-header current-route="/guides/"></app-header>
`;
