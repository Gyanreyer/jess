const withPlugins = require("next-compose-plugins");
/* Plugins */
// Optimizes image assets at build time
const optimizedImages = require("next-optimized-images");
// Transpile npm modules
const withTM = require("next-transpile-modules")(["react-hover-video-player"]);

module.exports = withPlugins([optimizedImages, withTM], {
  webpack: (cfg) => {
    cfg.module.rules.push({
      test: /\.yml$/,
      type: "json",
      use: "yaml-loader",
    });
    return cfg;
  },
});
