import "./latest-post.js";

const meta = {
  title: "Components/Latest Post",
};

export default meta;

export const Primary = () => `
  <app-latest-post
    link="/blog/release/v0.30.0/"
    title="We just launched v0.30.0"
  ></app-latest-post>
`;

export const CustomIcon = () => `
  <app-latest-post
    link="/blog/state-of-greenwood-2025/"
    title="Read the <em>State of Greenwood</em> 2025"
    icon="📚"
  ></app-latest-post>
`;
