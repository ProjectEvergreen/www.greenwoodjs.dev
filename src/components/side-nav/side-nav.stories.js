import "./side-nav.js";
import pages from "../../stories/mocks/graph.json";

export default {
  title: "Components/Side Nav",
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

const Template = () =>
  "<app-side-nav route='/guides/' heading='Guides' current-route='/guides/getting-started/key-concepts/'></app-side-nav>";

export const Primary = Template.bind({});
