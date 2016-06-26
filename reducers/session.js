const initialState = {
  account: null
};

module.exports = function (state, action) {
  if (typeof state === 'undefined') {
    return Object.assign({}, initialState); // Clone initialState !!!
  }

  switch (action.type) {
    case 'SESSION__SET_ACCOUNT':
      state.account = action.account; // TODO
    break;
    case 'SESSION__LOGOUT':
      // TODO
    break;
    case 'SESSION__LOGOUT--SUCCESS':
      state.account = null; // TODO
    break;
    case 'SESSION__LOGOUT--FAILURE':
      // TODO
    break;
  }

  return state;
}