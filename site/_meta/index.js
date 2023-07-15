const { readFileSync } = require('fs');
const { load: loadYaml } = require('js-yaml');
const { join } = require('path');
const package = require('../package.json');

// TODO: should we read package.json dynamically?

const DATA_DIR = join(__dirname, '../_data');

function readYamlSync(file) {
  return loadYaml(readFileSync(file, 'utf8'));
}



let data = {};

function version() {
  return package.version ? `v${package.version}` : 'dev';
}

function pages() {
  let sitemap = computePaths('', readYamlSync(join(DATA_DIR, 'sitemap.yml')));
  return addPages({}, sitemap);
}

function computePaths(parentPath, pages) {
  return pages.map(page => computePath(parentPath, page));
}

function computePath(parentPath, { path, children = [], ...page }) {
  path = `${parentPath}/${path}`;
  return {
    path: `${path}/`,
    children: computePaths(path, children),
    ...page,
  };
}

function addPages(result, pages) {
  for (const page of pages) {
    addPage(result, page);
  }
  return result;
}

function addPage(result, { path, children = [], ...page }) {
  if (!path) {
    return result;
  }
  result[path] = {
    path,
    children: children.map(({ children, ...child }) => child),
    ...page
  };
  return addPages(result, children);
}

function reload() {
  Object.assign(data, {
    version: version(),
    pages: pages(),
  });
}

reload();

console.log(data);

module.exports = {
  reload,
  data: new Proxy(data, {
    set() {}
  }),
};
