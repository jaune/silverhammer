const React = require('react');
const ReactDOM = require('react-dom');
const Redux = require('redux');
const ReactRedux = require('react-redux');
const Provider = React.createFactory(ReactRedux.Provider);
const thunk = require('redux-thunk').default;

module.exports = function (Page) {
  const container = document.querySelector('[data-page-root]');
  const state = JSON.parse(document.querySelector('[data-page-state]').textContent);

  var store = Redux.createStore(
    require('../reducers'),
    state,
    function () {
      return Redux.applyMiddleware(thunk).apply(this, [window.devToolsExtension().apply(this, arguments)]);
    }
  );

  ReactDOM.render(Provider({ store : store }, React.createElement(Page)), container);
};