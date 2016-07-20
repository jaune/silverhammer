const Redux = require('redux');

module.exports = Redux.combineReducers({
  page: require('./page.js'),
  i18n: require('./i18n.js'),
  session: require('./session.js'),
  router: require('../lib/router/reducer.js'),
  collections: require('./collections.js'),
  constants: require('./constants.js')
});
