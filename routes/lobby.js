const express = require('express');
const uuidv4 = require('uuid').v4;
var logger = require('../logger.js');

const renderPage = require('../lib/entry-renderer.js');
const renderRedirectPage = require('../lib/redirect-page-renderer.js');
const Redux = require('redux');

var router = express.Router();

const i = require('../lib/initiate-state.js');


function loadAccountFromSession(req, res, next) {
  var account_uuid;

  try {
    account_uuid = req.session.user.account_uuid;
  } catch (error) {
  }

  if (!account_uuid) {
    res.sendStatus(401); // 401 Unauthorized
    return;
  }

  req.app.services.mongodb.collection('accounts').findOne({ uuid: account_uuid }, function (error, account) {
    if (error) {
      return next(error);
    }

    if (!account) {
      return res.sendStatus(403); // 403 Forbidden
    }

    req.account = account;

    next();
  });
}

function loadLobbyFromParams(req, res, next) {
  var lobby_uuid = req.params.lobby_uuid;

  if (typeof lobby_uuid !== 'string') {
    return res.sendStatus(400); // 400 Bad Request
  }

  req.app.services.mongodb.collection('lobbies').findOne({ uuid: lobby_uuid }, function (error, lobby) {
    if (error) {
      return next(error);
    }

    if (!lobby) {
      return res.sendStatus(404); // 404 Not Found
    }

    req.lobby = lobby;
    next();
  });
}


router.use('/lobby', loadAccountFromSession);

// Create lobby
router.post('/lobby/', function (req, res, next) {
  res.type('json');

  var account = req.account;

  var query = {
    players: {
      $elemMatch: {
        id: account.id
      }
    }
  };

  // Check if the current account, is already in a lobby
  req.app.services.mongodb.collection('lobbies').findOne(query, function (error, result) {
    if (error) {
      return next(error);
    }

    if (result) {
      return res.sendStatus(400); // 400 Bad Request
    }

    var lobby = {
      uuid: uuidv4(),
      players: [
        {
          id: account._id,
          uuid: account.uuid
        }
      ]
    };

    // Create the lobby
    req.app.services.mongodb.collection('lobbies').insertOne(lobby, function (error, result) {
      if (error) {
        return next(error);
      }

      res.json({ uuid: lobby.uuid });
    });
  });
});

// lobby page
router.get('/lobby/:lobby_uuid.html', [i.initiateState, i.initiateStateRouter, i.initiateStateSessionAccountFromSession, i.initiateStateCollectionLobbyFromParams], function (req, res, next) {
  var store = Redux.createStore(require('../reducers'), req.initialState);

  res.type('html');
  res.send(renderPage(require('../components/entry/Default.jsx'), store, req.app.services.router));
});

// get lobby state
router.get('/lobby/:lobby_uuid', loadLobbyFromParams, function (req, res, next) {
  res.type('json');
  res.send(req.lobby);
});

// join lobby
router.post('/lobby/:lobby_uuid/player/', loadLobbyFromParams, function (req, res, next) {
  res.type('json');
});

module.exports = router;