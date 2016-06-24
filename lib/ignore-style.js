var fs = require('fs');

var installed = false;

function install(options) {
  if (installed) {
    return;
  }

  options = options || {};

  function customRequire(module, filename) {
    module._compile('', filename);
  };

  require.extensions['.scss'] = customRequire;
  require.extensions['.css'] = customRequire;

  installed = true;
}

module.exports = {
  install: install
};