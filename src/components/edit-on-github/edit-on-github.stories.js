import "./edit-on-github.js";
import pages from "../../stories/mocks/graph.json";

export default {
  title: "Components/Edit on GitHub",
  component: "app-edit-on-github",
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

const Template = (props) => {
  return `
    <div style="margin:1em 0;"><p>Linked File: ${props.args.route}</p></div>
    <app-edit-on-github label="${props.args.label}" route="${props.args.route}"></app-edit-on-github>
  `;
};

export const DefaultLabel = Template.bind(
  {},
  {
    args: {
      route: "/",
    },
  },
);

export const Root = Template.bind(
  {},
  {
    args: {
      route: "/",
      label: "Edit Root Page",
    },
  },
);

export const Directory = Template.bind(
  {},
  {
    args: {
      route: "/guides/hosting/",
      label: "Edit Directory Page",
    },
  },
);

export const Static = Template.bind(
  {},
  {
    args: {
      route: "/guides/hosting/netlify",
      label: "Edit Static Page",
    },
  },
);
