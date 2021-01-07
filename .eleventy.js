const htmlmin = require("html-minifier");
const Image = require("@11ty/eleventy-img");
const svgContents = require("eleventy-plugin-svg-contents");

const markdown = require("markdown-it")({ html: true });
const { minify } = require("terser");
const {documentToHtmlString} = require('@contentful/rich-text-html-renderer');

module.exports = function (eleventyConfig) {
    eleventyConfig.addPlugin(svgContents);

    eleventyConfig.setUseGitIgnore(false);
    eleventyConfig.addWatchTarget("./_tmp/style.css");
    eleventyConfig.addPassthroughCopy({ "./_tmp/style.css": "./style.css" });
    eleventyConfig.addShortcode("version", function () {
        return String(Date.now());
    });

    eleventyConfig.addShortcode('documentToHtmlString', documentToHtmlString);

    eleventyConfig.addNunjucksAsyncFilter("jsmin", async function (
      code,
      callback
    ) {
      try {
        const minified = await minify(code);
        callback(null, minified.code);
      } catch (err) {
        console.error("Terser error: ", err);
        // Fail gracefully.
        callback(null, code);
      }
    });

    eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
        if (
          process.env.ELEVENTY_PRODUCTION &&
          outputPath &&
          outputPath.endsWith(".html")
        ) {
          let minified = htmlmin.minify(content, {
            useShortDoctype: true,
            removeComments: true,
            collapseWhitespace: true,
          });
          return minified;
        }
        return content;
    });

    eleventyConfig.addNunjucksShortcode(
      "markdown",
      content => `${markdown.render(content)}`
    );

    eleventyConfig.addPassthroughCopy({
      "./node_modules/alpinejs/dist/alpine.js": "./js/alpine.js",
    });

    eleventyConfig.addPassthroughCopy("vercel.json");
    eleventyConfig.addPassthroughCopy('img');

     // works also with addLiquidShortcode or addJavaScriptFunction
     eleventyConfig.addNunjucksAsyncShortcode("image", async function(src, alt) {
      if(alt === undefined) {
        // You bet we throw an error on missing alt (alt="" works okay)
        throw new Error(`Missing \`alt\` on myImage from: ${src}`);
      }

      let metadata = await Image(src, {
        widths: [null],
        formats: ["jpeg"],
        urlPath: "/images/",
        outputDir: "./_site/images/"
      });

      let data = metadata.jpeg.pop();
      return `<img src="${data.url}" width="${data.width}" height="${data.height}" alt="${alt}">`;
    });

    eleventyConfig.addNunjucksAsyncShortcode("responsiveimage", async function(src, alt, sizes = "100vw") {
      if(alt === undefined) {
        // You bet we throw an error on missing alt (alt="" works okay)
        throw new Error(`Missing \`alt\` on responsiveimage from: ${src}`);
      }
  
      let metadata = await Image(src, {
        widths: [300, 600, 800],
        formats: ['webp', 'jpeg', 'avif'],
        outputDir: "./_site/img/"

      });
  
      let lowsrc = metadata.jpeg[0];
  
      return `<picture>
        ${Object.values(metadata).map(imageFormat => {
          return `  <source type="image/${imageFormat[0].format}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="${sizes}">`;
        }).join("\n")}
          <img
            class="w-full"
            src="${lowsrc.url}"
            width="${lowsrc.width}"
            height="${lowsrc.height}"
            alt="${alt}" />
        </picture>`;
    });
    

};

