var path = require("path");

module.exports = {
  entry: "./lib/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "slate-instant-replace.js",
    library: 'slateInstantReplace',
    libraryTarget: 'umd'
  },
  externals: {
    slate: {
      commonjs: "slate",
      commonjs2: "slate",
      amd: "slate",
      root: "_",
    },
  },
};
