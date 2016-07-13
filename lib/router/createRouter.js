var pathToRegexp = require('path-to-regexp');

module.exports = function (settings) {

  var routes = settings.routes || [];

  var matchers = routes.map(function (route) {
    var keys = [];

    return {
      regexp: pathToRegexp(route.pattern, keys),
      keys: keys
    }
  });

  return {
    getSettings: function () {
      return settings;
    },
    resolve: function (path) {
      var candidate;

      var i, l, matches, matcher;

      for (i = 0, l = routes.length; i < l; i++) {
        matcher = matchers[i];
        matches = matcher.regexp.exec(path);

        if (Array.isArray(matches)) {

          candidate = Object.assign({
            path: path,
            url: settings.base + path,
            params: {}
          }, routes[i]);

          matcher.keys.forEach(function (key, index) {
            if (typeof key.name === 'string') {
              candidate.params[key.name] = matches[index + 1];
            }
          });

          break;
        }
      }

      if (!candidate) {
        console.log('Warning: Missing route matches. `' + path + '`');
        return;
      }

      return candidate;
    }
  };
};
