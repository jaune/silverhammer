const Redux = require('redux');

module.exports = Redux.combineReducers({
  lobby: lobbyReducer,
  account: lobbyAccount
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
