const initialState = {
  passports: [],
  authorization: null,
  account: null
};

module.exports = function (state, action) {
  if (typeof state === 'undefined') {
    return Object.assign({}, initialState); // Clone initialState !!!
  }

  switch (action.type) {
    case 'PASSPORTS_RECEIVE':
      state.passports = action.passports;
    break;
    case 'AUTHORIZATION_RECEIVE':
      state.authorization = action.authorization;
    break;
    case 'ACCOUNT_RECEIVE':
      state.account = action.account;
    break;
  }

  return state;
}