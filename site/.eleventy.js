const { EleventyRenderPlugin } = require("@11ty/eleventy");
const markdownIt = require('markdown-it');
const yaml = require('js-yaml');
const meta = require('./_meta');

const markdown = markdownIt({ html: true });

module.exports = function(config) {
  config.setLibrary('md', markdown);
  config.addPlugin(EleventyRenderPlugin);
  config.addDataExtension('yml', contents => yaml.load(contents));

  config.addPassthroughCopy({
    asset: '/',
    dist: '/',
  });
  config.setServerOptions({
    domDiff: false
  });

  config.addNunjucksFilter('markdown', value => markdown.renderInline(value));

  config.addNunjucksGlobal('meta', meta.data);
  config.on('eleventy.before', () => meta.reload());

  if (process.env.NODE_ENV === 'production') {
    config.addNunjucksGlobal('gaid', 'G-LS32PJ4JZJ');
  }
  config.addGlobalData('layout', 'base.njk');

  return {
    markdownTemplateEngine: 'njk', // 11ty offers stronger context support with njk toolchain
    pathPrefix: '/easyxq/',
    dir: {
      input: 'page',
      includes: '../_includes',
      layouts: '../_layouts',
      data: '../_data',
    }
  }
};
