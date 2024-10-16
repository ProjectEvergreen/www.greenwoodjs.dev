import "./edit-on-github.js";

export default {
  title: "Components/Edit on GitHub",
  component: "app-edit-on-github",
};

const Template = (props) => {
  return `
    <div style="margin:1em 0;"><p>Linked Route: ${props.args.route}</p></div>
    <app-edit-on-github route="${props.args.route}"></app-edit-on-github>
  `;
};

export const Root = Template.bind(
  {},
  {
    args: {
      route: "/",
    },
  },
);

export const Directory = Template.bind(
  {},
  {
    args: {
      route: "/guides/hosting/",
    },
  },
);

export const Static = Template.bind(
  {},
  {
    args: {
      route: "/guides/hosting/netlify",
    },
  },
);
