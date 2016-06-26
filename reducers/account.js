const initialState = {
  accountMe: null,
  accountOther: null
};

module.exports = function (state, action) {
  if (typeof state === 'undefined') {
    return Object.assign({}, initialState); // Clone initialState !!!
  }

  switch (action.type) {
    case 'ACCOUNT__SET_ACCOUNT_ME':
      state.accountMe = action.account;
    break;
    case 'ACCOUNT__SET_ACCOUNT_OTHER':
      state.accountOther = action.account;
    break;
  }

  return state;
}