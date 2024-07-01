// would like to get rid of this need, ideally
// https://github.com/ProjectEvergreen/greenwood/discussions/1238
export default {
  plugins: [(await import("postcss-import")).default],
};
