var initialState = {
  account: null
};

module.exports = function (state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }

  switch (action.type) {
    case 'SESSION_ACCOUNT':
      state.account = action.account; // TODO
    break;
    case 'LOGOUT':
      // TODO
    break;
    case 'LOGOUT--SUCCESS':
      state.account = null; // TODO
    break;
    case 'LOGOUT--FAILURE':
      // TODO
    break;
  }

  return state;
}