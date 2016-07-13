// TODO SESSION__LOGOUT--FAILURE

function requestSessionDelete() {
  return new Promise(function (resolve, reject) {
    var client = new XMLHttpRequest();

    client.addEventListener('readystatechange', function (event) {
      if ((client.readyState === XMLHttpRequest.DONE) && (client.status === 200)) {
        resolve();
      }
    });

    client.open('DELETE', '/session/@me');
    client.send();
  });
}

function logOut() {
  return function (dispatch) {
    dispatch({
      type: 'session/DELETE'
    });

    return requestSessionDelete().then(function () {
      dispatch({
        type: 'session/DELETE--SUCCESS'
      });
    }, function (error) {
      dispatch({
        type: 'session/DELETE--FAILURE'
      });
    });
  };
}

module.exports = {
  logOut: logOut
};