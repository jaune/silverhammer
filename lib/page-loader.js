const loaderUtils = require('loader-utils'),
      path = require('path'),
      fs = require('fs');

module.exports = function(source) {
  if(this.cacheable) this.cacheable();

  var url = loaderUtils.getRemainingRequest(this);

  var parts = path.parse(this.resourcePath);
  var stylePath = path.format({
    dir: parts.dir,
    name: parts.name,
    ext: '.scss'
  });

  var result = [
    'const launch = require(' + loaderUtils.stringifyRequest(this, require.resolve('./page-launcher.js')) + ');',
    'const Page = require(' + loaderUtils.stringifyRequest(this, url) + ');',
    '',
    'launch(Page);'
  ];

  return result.join('\n')
};