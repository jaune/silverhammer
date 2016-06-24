const Redux = require('redux');

module.exports = Redux.combineReducers({
  page: require('./page.js'),
  i18n: require('./i18n.js'),
  authorize: require('./authorize.js'),
});
