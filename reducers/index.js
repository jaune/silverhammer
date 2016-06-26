const Redux = require('redux');

module.exports = Redux.combineReducers({
  page: require('./page.js'),
  i18n: require('./i18n.js'),
  session: require('./session.js'),
  authorize: require('./authorize.js'),
  account: require('./account.js')
});
