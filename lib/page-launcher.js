const React = require('react');
const ReactDOM = require('react-dom');
const Redux = require('redux');
const ReactRedux = require('react-redux');
const Root = React.createFactory(require('./Root.jsx'));
const thunk = require('redux-thunk').default;
const createRouter = require('./router/createRouter.js');

function historyMiddleware(store) {
  return function (next) {
    return function (action) {
      if (action.type === 'router/PUSH_HISTORY_STATE') {
        window.history.pushState(action.payload, '', action.payload.url);
      }
      return next(action);
    };
  };
}

module.exports = function (Page) {
  const container = document.querySelector('[data-page-root]');
  const state = JSON.parse(document.querySelector('[data-page-state]').textContent);
  const routerSettings = JSON.parse(document.querySelector('[data-router-settings]').textContent);

  var store = Redux.createStore(
    require('../reducers'),
    state,
    function () {
      return Redux.applyMiddleware(thunk, historyMiddleware).apply(this, [window.devToolsExtension().apply(this, arguments)]);
    }
  );

  var router = createRouter(routerSettings);

  window.history.replaceState(store.getState().router, state.page.title);

  window.addEventListener('popstate', function (event) {
    store.dispatch(Object.assign({ type: 'router/POP_HISTORY_STATE', payload: event.state }));
  });

  ReactDOM.render(Root({ store : store, router: router }, React.createElement(Page)), container);
};