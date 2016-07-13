const initialState = {
  account: null
};

module.exports = function (state, action) {
  if (typeof state === 'undefined') {
    return Object.assign({}, initialState);
  }

  switch (action.type) {
    case 'session/DELETE':
      // TODO
    break;
    case 'session/DELETE--SUCCESS':
      return Object.assign({}, state, {
        account: null
      });
    break;
    case 'session/DELETE--FAILURE':
      // TODO
    break;
  }

  return state;
}