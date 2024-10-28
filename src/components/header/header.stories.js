import "./header.js";
import pages from "../../stories/mocks/graph.json";

export default {
  title: "Components/Header",
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

const Template = () => "<app-header></app-header>";

export const Primary = Template.bind({});
