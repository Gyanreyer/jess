const withPlugins = require("next-compose-plugins");
/* Plugins */
// Optimizes image assets at build time
const optimizedImages = require("next-optimized-images");
// Enables using fonts
const withFonts = require("next-fonts");

module.exports = withPlugins(
  [optimizedImages],
  withFonts({
    webpack: (cfg) => {
      cfg.module.rules.push({
        test: /\.md$/,
        loader: "frontmatter-markdown-loader",
        options: { mode: ["react-component"] },
      });
      return cfg;
    },
  })
);
