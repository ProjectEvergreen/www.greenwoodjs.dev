import "./header.js";
import pages from "../../stories/mocks/graph.json";

export default {
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

const Template = () => "<app-header current-route='/guides/'></app-header>";

export const Primary = Template.bind({});
