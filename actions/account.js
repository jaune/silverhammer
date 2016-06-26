function setAccountMe(account) {
  return {
    type: 'ACCOUNT__SET_ACCOUNT_ME',
    account: account
  };
}

function setAccountOther(account) {
  return {
    type: 'ACCOUNT__SET_ACCOUNT_Other',
    account: account
  };
}

module.exports = {
  setAccountMe: setAccountMe,
  setAccountOther: setAccountOther
};