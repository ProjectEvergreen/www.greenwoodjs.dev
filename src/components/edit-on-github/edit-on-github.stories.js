import "./edit-on-github.js";
import pages from "../../stories/mocks/graph.json";

export default {
  title: "Components/Edit on GitHub",
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

const Template = () => "<app-edit-on-github route='/guides/getting-started/'></app-edit-on-github>";

export const Primary = Template.bind({});
