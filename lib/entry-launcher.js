const React = require('react');
const ReactDOM = require('react-dom');
const Redux = require('redux');
const ReactRedux = require('react-redux');
const thunk = require('redux-thunk').default;
const createRouter = require('./router/createRouter.js');
const createFetcher = require('./fetcher/createFetcher.js');




function requestJSON(path) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('readystatechange', function (event) {
      if ((xhr.readyState === XMLHttpRequest.DONE) && (xhr.status === 200)) {
        var data;

        try {
          data = JSON.parse(xhr.responseText);
        } catch (error) {
        }
        return resolve(data);
      }
    });

    xhr.open('GET', path);
    xhr.send();
  });
}

var fetcher;


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

module.exports = function (EntryComponent) {
  const container = document.querySelector('[data-page-root]');
  const state = JSON.parse(document.querySelector('[data-page-state]').textContent);
  const routerSettings = JSON.parse(document.querySelector('[data-router-settings]').textContent);
  const Entry = React.createFactory(EntryComponent);

  var store = Redux.createStore(
    require('../reducers'),
    state,
    Redux.compose(
      Redux.applyMiddleware(thunk, historyMiddleware),
      window.devToolsExtension()
    )
  );

  var router = createRouter(routerSettings);
  fetcher = createFetcher(store);

  window.history.replaceState(store.getState().router, state.page.title);

  window.addEventListener('popstate', function (event) {
    store.dispatch(Object.assign({ type: 'router/POP_HISTORY_STATE', payload: event.state }));
  });

  ReactDOM.render(Entry({ store : store, router: router, fetcher: fetcher }), container);

  fetcher.startRecord();
};