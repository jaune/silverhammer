// TODO SESSION__LOGOUT--FAILURE

function logOut() {
  return function (dispatch) {
    var client = new XMLHttpRequest();

    dispatch({
      type: 'SESSION__LOGOUT'
    });

    client.addEventListener('readystatechange', function (event) {
      if ((client.readyState === XMLHttpRequest.DONE) && (client.status === 200)) {
        dispatch({
          type: 'SESSION__LOGOUT--SUCCESS'
        });
      }
    });

    client.open('DELETE', '/session/@me');
    client.send();

    return null;
  };
}

function setAccount(account) {
  return {
    type: 'SESSION__SET_ACCOUNT',
    account: account
  };
}

module.exports = {
  logOut: logOut,
  setAccount: setAccount
};