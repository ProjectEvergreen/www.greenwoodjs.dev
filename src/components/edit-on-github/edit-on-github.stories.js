import "./edit-on-github.js";

const meta = {
  title: "Components/Edit on GitHub",
  component: "app-edit-on-github",
};

export default meta;

const template = ({ route }) => {
  return `
    <div style="margin:1em 0;"><p>Linked Route: ${route}</p></div>
    <app-edit-on-github route="${route}"></app-edit-on-github>
  `;
};

export const PageRoot = () => template({ route: "/guides/" });
export const SectionRoot = () => template({ route: "/guides/hosting/" });
export const Section = () => template({ route: "/guides/hosting/netlify/" });
