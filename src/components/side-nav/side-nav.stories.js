import "./side-nav.js";
import pages from "../../stories/mocks/graph.json" with { type: "json" };

const ROUTE = "/guides/";

const meta = {
  title: "Components/Side Nav",
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

export const Primary = () => `
  <app-side-nav route="${ROUTE}" heading="Guides" current-route="/guides/getting-started/key-concepts/">
  </app-side-nav>
`;
