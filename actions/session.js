function logOut() {
  return function (dispatch) {
    var client = new XMLHttpRequest();

    client.addEventListener('readystatechange', function (event) {
      if ((client.readyState === XMLHttpRequest.DONE) && (client.status === 200)) {
        dispatch({
          type: 'LOGOUT--SUCCESS'
        });
      }
    });

    client.open('DELETE', '/session/@me');
    client.send();

    return null;
  };
}

module.exports = {
  logOut: logOut
};