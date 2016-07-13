function requestCreateLobby() {
  return new Promise(function (resolve, reject) {
    var client = new XMLHttpRequest();

    client.addEventListener('readystatechange', function (event) {
      if ((client.readyState === XMLHttpRequest.DONE) && (client.status === 200)) {
        var data;

        try {
          data = JSON.parse(client.responseText);
        } catch (error) {
          return reject(error);
        }

        return resolve(data);
      }
    });

    client.open('POST', '/lobby/');
    client.send(JSON.stringify({
    }));
  });
}

function createLobby() {
  return function (dispatch) {
    dispatch({
      type: 'lobby/CREATE'
    });

    return requestCreateLobby()
      .then(function (payload) {
        dispatch({
          type: 'lobby/CREATE--SUCCESS',
          payload: payload
        });
      }, function (error) {
        dispatch({
          type: 'lobby/CREATE--FAILURE'
        });
      });
  };
}

function receiveLobby(lobby) {
  return {
    type: 'LOBBY__RECEIVE_LOBBY',
    lobby: lobby
  };
}

module.exports = {
  createLobby: createLobby,
  receiveLobby: receiveLobby
};