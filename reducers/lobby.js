const initialState = {};

module.exports = function (state, action) {
  if (typeof state === 'undefined') {
    return Object.assign({}, initialState); // Clone initialState !!!
  }

  switch (action.type) {
    case 'lobby/CREATE--SUCCESS':
      return Object.assign({}, state, action.payload);
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