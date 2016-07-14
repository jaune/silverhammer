const express = require('express');

const renderPage = require('../lib/entry-renderer.js');
const renderRedirectPage = require('../lib/redirect-page-renderer.js');
const Redux = require('redux');


var router = express.Router();

// Retrieve authorization from authorization_uuid
function loadAuthorizationFromParams(req, res, next) {
  var authorization_key = 'authorization/' + req.params.authorization_uuid;

  req.app.services.redis.get(authorization_key, function (error, value) {
    if (error) {
      return next(error);
    }

    var data;

    try {
      data = JSON.parse(value);
    } catch (error) {
    }

    if (!data) {
      return res.sendStatus(404); // 404 Not Found
    }

    if (data.session_id !== req.session.id) {
      return res.sendStatus(403); // 403 Forbidden
    }

    req.authorization = data;

    return next();
  });
};

router.get('/authorization/:authorization_uuid/form/add-authorization-to-account.html', loadAuthorizationFromParams, function (req, res) {
  const store = Redux.createStore(require('../reducers'));

  res.type('html');
  res.send(renderPage(require('../components/entry/Default.jsx'), store, req.app.services.router));
});

const thunk = require('redux-thunk').default;

const i = require('../lib/initiate-state.js');

router.get('/authorization/:authorization_uuid/form/create-account.html', [i.initiateState, i.initiateStateRouter, i.initiateStateSessionAccountFromSession, i.initiateStateAuthorizationFromParams], function (req, res, next) {
  var store = Redux.createStore(require('../reducers'), req.initialState);

  res.type('html');
  res.send(renderPage(require('../components/entry/Default.jsx'), store, req.app.services.router));
});

router.get('/authorization/:authorization_uuid/message/:message_key.html', loadAuthorizationFromParams, function (req, res) {
  res.send(req.params.message_key + '.html');
});

router.post('/account/@me/authorization/', function (req, res, next) {
  var account_uuid;

  try {
    account_uuid = req.session.user.account_uuid;
  } catch (error) {
  }

  if (!account_uuid) {
    return res.sendStatus(401); // 401 Unauthorized
  }

  var authorization_uuid = req.body.authorization_uuid;
  var authorization_key = 'authorization/' + authorization_uuid;

  req.app.services.redis.get(authorization_key, function (error, raw) {
    var authorization;

    try {
      data = JSON.parse(raw);
    } catch (error) {
    }

    if (!data) {
      return res.sendStatus(400); // 400 Bad Request
    }

    if (data.session_id !== req.session.id) {
      return res.sendStatus(403); // 403 Forbidden
    }

    var authorization = {
      id: data.authorization.id,
      provider: data.authorization.provider,
      displayName: data.authorization.displayName
    };

    req.app.services.mongodb.collection('accounts').updateOne({}, { $push : { 'authorizations' : authorization } }, function (error, result) {
      if (error) {
        return next(error);
      }

      req.app.services.redis.del(authorization_uuid); // async
      res.send(renderRedirectPage('http://localhost:5000/account/@me.html'));

    });
  });
});

module.exports = router;