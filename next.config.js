const withPlugins = require("next-compose-plugins");
/* Plugins */
// Optimizes image assets at build time
const optimizedImages = require("next-optimized-images");

module.exports = withPlugins([optimizedImages], {
  webpack: (cfg) => {
    cfg.module.rules.push({
      test: /\.yml$/,
      type: "json",
      use: "yaml-loader",
    });
    return cfg;
  },
});
