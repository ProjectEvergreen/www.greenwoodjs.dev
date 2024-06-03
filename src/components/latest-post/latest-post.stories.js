import "./latest-post.js";

export default {
  title: "Components/Latest Post",
};

const Template = () => `
  <app-latest-post
    link="/blog/release/v0.30.0/"
    title="We just launched v0.30.0"
  ></app-latest-post>
`;

export const Primary = Template.bind({});
