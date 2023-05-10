const fs = require("node:fs");

// 11ty plugins
const pluginWebc = require("@11ty/eleventy-plugin-webc");
const { eleventyImagePlugin } = require("@11ty/eleventy-img");
const bundlerPlugin = require("@11ty/eleventy-plugin-bundle");

// Minification/asset processing libs
const esbuild = require("esbuild");
const { minify: minifyCSS } = require("csso");
const { minify: minifyHTML } = require("html-minifier-terser");

const IS_PRODUCTION = process.env.NODE_ENV === "prod";

module.exports = function (eleventyConfig) {
  // Set up webc plugin to process all webc files
  eleventyConfig.addPlugin(pluginWebc, {
    components: [
      "src/_components/**/*.webc",
      "npm:@11ty/eleventy-img/*.webc",
      "npm:@11ty/is-land/**/*.webc",
    ],
  });

  // Trigger a hot reload when a JS/CSS file changes
  eleventyConfig.addWatchTarget("src/**/*.{js,mjs,css}");

  eleventyConfig.addPassthroughCopy({
    "src/assets/fonts": "/fonts",
    "src/assets/img/favicon.png": "/img/favicon.png",
    "src/assets/img/og.jpg": "/img/og.jpg",
    "src/assets/**/*.pdf": "/",
  });

  // Image plugin
  eleventyConfig.addPlugin(eleventyImagePlugin, {
    formats: ["webp", "auto"],
    widths: [320, 640, 960, 1280, 1920],
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
                  target: "es2015",
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
    if (
      IS_PRODUCTION &&
      this.page.outputPath &&
      this.page.outputPath.endsWith(".html")
    ) {
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

  eleventyConfig.on("eleventy.after", async ({ results }) => {
    const dataThemeRegex = /data-theme="([^"]*)"/;
    const htmlHeadStartRegex = /<head[^>]*>/;
    const htmlHeadEndRegex = /<\/head>/;
    const htmlBodyStartRegex = /<body[^>]*>/;
    const htmlBodyEndRegex = /<\/body>/;

    results.forEach(({ outputPath, content }) => {
      if (outputPath.endsWith(".html")) {
        const dataTheme = content.match(dataThemeRegex)[1];

        // Replace all double quotes with single quotes for cleaner serialization to JSON
        const sanitizedHTML = content.replace(/"/g, `'`);

        const headStartMatch = sanitizedHTML.match(htmlHeadStartRegex);
        const headEndMatch = sanitizedHTML.match(htmlHeadEndRegex);

        const bodyStartMatch = sanitizedHTML.match(htmlBodyStartRegex);
        const bodyEndMatch = sanitizedHTML.match(htmlBodyEndRegex);

        const headTagContents = sanitizedHTML.slice(
          headStartMatch.index + headStartMatch[0].length,
          headEndMatch.index
        );
        const bodyTagContents = sanitizedHTML.slice(
          bodyStartMatch.index + bodyStartMatch[0].length,
          bodyEndMatch.index
        );

        const pageContentJSON = {
          theme: dataTheme,
          head: headTagContents,
          body: bodyTagContents,
        };

        fs.writeFileSync(`${outputPath}.json`, JSON.stringify(pageContentJSON));
      }
    });
  });

  return {
    dir: {
      input: "src",
    },
  };
};
