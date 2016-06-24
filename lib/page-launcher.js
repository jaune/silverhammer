const React = require('react');
const ReactDOM = require('react-dom');
const Redux = require('redux');
const ReactRedux = require('react-redux');
const Provider = React.createFactory(ReactRedux.Provider);

module.exports = function (Page) {
  const container = document.querySelector('[data-page-root]');
  const state = JSON.parse(document.querySelector('[data-page-state]').textContent);

  var store = Redux.createStore(require('../reducers'), state);

  ReactDOM.render(Provider({ store : store }, React.createElement(Page)), container);
};