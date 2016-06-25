const express = require('express');

const renderPage = require('../lib/page-renderer.js');
const renderRedirectPage = require('../lib/redirect-page-renderer.js');
const Redux = require('redux');


var router = express.Router();

// Retrieve authorization from authorization_uuid
router.use('/authorization/:authorization_uuid', function (req, res, next) {
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
});

router.get('/authorization/:authorization_uuid/form/add-authorization-to-account.html', function (req, res) {
  const store = Redux.createStore(require('../reducers'));

  store.dispatch({
    type: 'AUTHORIZATION_RECEIVE',
    authorization: req.authorization
  });

  res.type('html');
  res.send(renderPage(require('../pages/authorization/AddToAccount.jsx'), store));
});

router.get('/authorization/:authorization_uuid/form/create-account.html', function (req, res) {
  const store = Redux.createStore(require('../reducers'));

  store.dispatch({
    type: 'AUTHORIZATION_RECEIVE',
    authorization: req.authorization
  });

  res.type('html');
  res.send(renderPage(require('../pages/authorization/CreateAccount.jsx'), store));
});

router.get('/authorization/:authorization_uuid/message/:message_key.html', function (req, res) {

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