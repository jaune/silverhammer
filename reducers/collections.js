const Redux = require('redux');

module.exports = Redux.combineReducers({
  lobby: lobbyReducer,
  account: lobbyAccount,
  passport: lobbyPassport
});

function lobbyReducer (state, action) {
  if (typeof state === 'undefined') {
    return {};
  }

  switch (action.type) {
    case 'lobby/CREATE--SUCCESS':
      return Object.assign({}, state, {
        [action.payload.uuid]: action.payload
      });
    break;

    case 'lobby/SEND_MESSAGE':
      return Object.assign({}, state);
    break;
    case 'lobby/SEND_MESSAGE--SUCCESS':
    break;
    case 'lobby/SEND_MESSAGE--FAILURE':
    break;
  }

  return state;
}

function lobbyAccount (state, action) {
  if (typeof state === 'undefined') {
    return {};
  }

  switch (action.type) {
  }

  return state;
}

function lobbyPassport (state, action) {
  if (typeof state === 'undefined') {
    return {};
  }

  switch (action.type) {
    case 'fetcher/RECEIVE':
      if (action.pattern === 'collections.passport.*') {
        var state = Object.assign({}, state);

        action.items.forEach(function (item) {
          state[item.key] = item;
        });
      }
      break;
  }

  return state;
}
