// TODO get this functionality from Greenwood itself
export default {
  plugins: [{
    type: 'copy',
    name: 'plugin-geist-font',
    provider: (compilation) => {
      const { outputDir, projectDirectory } = compilation.context;

      return [{
        from: new URL('./node_modules/geist/dist/fonts/', projectDirectory),
        to: new URL('./node_modules/geist/dist/fonts/', outputDir)
      }];
    }
  }]
}