const withPlugins = require("next-compose-plugins");
/* Plugins */
// Transpile npm modules
const withTM = require("next-transpile-modules")(["react-hover-video-player"]);

module.exports = withPlugins([withTM], {
  webpack: (cfg) => {
    cfg.module.rules.push({
      test: /\.yml$/,
      type: "json",
      use: "yaml-loader",
    });
    return cfg;
  },
  images: {
    imageSizes: [120, 240, 480, 720, 1080, 1920],
  },
});
