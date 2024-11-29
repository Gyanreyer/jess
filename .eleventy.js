// 11ty plugins
import pluginWebc from "@11ty/eleventy-plugin-webc";
import { eleventyImagePlugin } from "@11ty/eleventy-img";
import bundlerPlugin from "@11ty/eleventy-plugin-bundle";

// Minification/asset processing libs
import sharp from "sharp";
import esbuild from "esbuild";
import { minify as minifyCSS } from "csso";
import { minify as minifyHTML } from "html-minifier-terser";
import { readdir, mkdir } from "node:fs/promises";

const IS_PRODUCTION = process.env.NODE_ENV === "prod";

/**
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig
 */
export default function (eleventyConfig) {
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
    "src/assets/video": "/video",
    "src/assets/js": "/js",
  });

  // Image plugin
  eleventyConfig.addPlugin(eleventyImagePlugin, {
    formats: ["avif", "webp", "auto"],
    widths: [320, 720, 1280, 1920],
    urlPath: "/img/",
    outputDir: "./_site/img/",
    defaultAttributes: {
      loading: "lazy",
      decoding: "async",
    },
  });

  const renderAttributeName = (name) => {
    let result = "";
    let prevChar;
    for (let i = 0; i < name.length; ++i) {
      const char = name[i];
      if (
        char === char.toUpperCase() &&
        prevChar &&
        prevChar === prevChar.toLowerCase()
      ) {
        result += `-${char.toLowerCase()}`;
      } else {
        result += char.toLowerCase();
      }
      prevChar = char;
    }

    return result;
  };

  eleventyConfig.addJavaScriptFunction(
    "renderAttributes",
    /**
     * @param {Record<string, unknown>} attributes
     */
    (attributes) => {
      return Object.entries(attributes)
        .map(([key, value]) => `${renderAttributeName(key)}="${value}"`)
        .join(" ");
    }
  );

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
                  target: "es2020",
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

  return {
    dir: {
      input: "src",
    },
  };
}
