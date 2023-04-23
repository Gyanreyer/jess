// 11ty plugins
const pluginWebc = require("@11ty/eleventy-plugin-webc");
const { eleventyImagePlugin } = require("@11ty/eleventy-img");
const bundlerPlugin = require("@11ty/eleventy-plugin-bundle");

const {
  promises: { readFile },
} = require("fs");

// Libs to support toml data files
const toml = require("@iarna/toml");
const markdownIt = require("markdown-it")();

// Minification/asset processing libs
const esbuild = require("esbuild");
const { minify: minifyCSS } = require("csso");
const { minify: minifyHTML } = require("html-minifier-terser");

const IS_PRODUCTION = process.env.NODE_ENV === "prod";

module.exports = function (eleventyConfig) {
  // Set up webc plugin to process all webc files
  eleventyConfig.addPlugin(pluginWebc, {
    components: ["src/_components/**/*.webc", "npm:@11ty/eleventy-img/*.webc"],
  });

  // Trigger a hot reload when a JS/CSS file changes
  eleventyConfig.addWatchTarget("src/**/*.{js,mjs,css}");

  eleventyConfig.addPassthroughCopy({ "src/assets/fonts": "fonts" });

  // Image plugin
  eleventyConfig.addPlugin(eleventyImagePlugin, {
    formats: ["avif", "webp", "auto"],
    sharpOptions: { animated: true },
    widths: [320, 640, 960, 1280, 1600, 1920],
    urlPath: "/img/",
    outputDir: "./_site/img/",
    defaultAttributes: {
      loading: "lazy",
      decoding: "async",
    },
  });

  // Apply custom transforms to bundled JS and CSS
  eleventyConfig.addPlugin(bundlerPlugin, {
    transforms: [
      async function (content) {
        switch (this.type) {
          case "js":
            try {
              // Minify the JS bundle for production builds
              return (
                await esbuild.transform(content, {
                  minify: IS_PRODUCTION,
                })
              ).code;
            } catch (e) {
              console.error("Error while minifying JS bundle:", e);
            }
            break;
          case "css":
            try {
              // Minify the CSS bundle
              return minifyCSS(content).css;
            } catch (e) {
              console.error("Error while minifying CSS bundle:", e);
            }
            break;
          default:
        }

        return content;
      },
    ],
  });

  // Minify the HTML output
  eleventyConfig.addTransform("htmlmin", async function (content) {
    if (this.page.outputPath && this.page.outputPath.endsWith(".html")) {
      try {
        return await minifyHTML(content, {
          useShortDoctype: true,
          removeComments: true,
          collapseWhitespace: true,
        });
      } catch (e) {
        console.error("HTML minification error: ", e);
        return content;
      }
    }

    return content;
  });

  return {
    dir: {
      input: "src",
    },
  };
};