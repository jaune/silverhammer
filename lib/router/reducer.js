const initialState = {
  path: null,
  url: null
};

module.exports = function (state, action) {
  if (typeof state === 'undefined') {
    return Object.assign({}, initialState); // Clone initialState !!!
  }

  switch (action.type) {
    case 'router/PUSH_HISTORY_STATE':
      return Object.assign({}, action.payload);
    break;
    case 'router/POP_HISTORY_STATE':
      return Object.assign({}, action.payload);
    break;
  }

  return state;
}