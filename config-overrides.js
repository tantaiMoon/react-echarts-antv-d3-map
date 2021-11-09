const {
  override,
  addDecoratorsLegacy,
  disableEsLint,
  addBundleVisualizer,
  addWebpackAlias,
  adjustWorkbox
} = require("customize-cra");
const proxy = require('http-proxy-middleware')
const path = require("path");

module.exports = override(
  // enable legacy decorators babel plugin
  addDecoratorsLegacy(),


  // add an alias for "ag-grid-react" imports
  addWebpackAlias({
    // ["ag-grid-react$"]: path.resolve(__dirname, "src/shared/agGridWrapper.js")
    "@": path.resolve(__dirname, "src"),
    "@components": path.resolve(__dirname, "src/components"),
    "@static": path.resolve(__dirname, "src/static")
  }),
);
