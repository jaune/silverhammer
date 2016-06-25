"use strict";

const express = require('express');
const uuidv4 = require('uuid').v4;

const renderPage = require('../lib/page-renderer.js');
const renderRedirectPage = require('../lib/redirect-page-renderer.js');
const Redux = require('redux');

var router = express.Router();

router.post('/account/', function (req, res, next) {
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

    var account = {
      uuid: uuidv4(),
      displayName: data.authorization.displayName,
      authorizations: [
        {
          id: data.authorization.id,
          provider: data.authorization.provider,
          displayName: data.authorization.displayName
        }
      ]
    };

    req.app.services.mongodb.collection('accounts').insertOne(account, function (error, result) {
      if (error) {
        return next(error);
      }

      if (result.result.n !== 1) {
        return next(new Error('Unexpected result.'));
      }

      // Create session.
      req.session.user = {
        account_uuid: account.uuid
      };

      req.session.save(function(error) {
        if (error) {
          return next(error);
        }

        req.app.services.redis.del(authorization_uuid); // async
        res.send(renderRedirectPage('http://localhost:5000/account/@me.html'));
      });

    });
  });
});


router.get('/account/@me', function (req, res, next) {
  res.type('json');

  var account_uuid;

  try {
    account_uuid = req.session.user.account_uuid;
  } catch (error) {
  }

  if (!account_uuid) {
    return res.sendStatus(401); // 401 Unauthorized
  }

  req.app.services.mongodb.collection('accounts').findOne({ uuid: account_uuid }, function (error, account) {
    if (error) {
      return next(error);
    }

    if (!account) {
      return res.sendStatus(404); // 404 Not Found
    }

    res.json({
      uuid: account.uuid,
      label: account.displayName
    });
  });
});


router.get('/account/@me.html', function (req, res, next) {
  res.type('html');

  var account_uuid;

  try {
    account_uuid = req.session.user.account_uuid;
  } catch (error) {
  }

  if (!account_uuid) {
    return res.sendStatus(401); // 401 Unauthorized
  }

  req.app.services.mongodb.collection('accounts').findOne({ uuid: account_uuid }, function (error, account) {
    if (error) {
      return next(error);
    }

    if (!account) {
      return res.sendStatus(404); // 404 Not Found
    }

    const store = Redux.createStore(require('../reducers'));

    store.dispatch({
      type: 'ACCOUNT_RECEIVE',
      account: account
    });

    res.send(renderPage(require('../pages/account/Me.jsx'), store));
  });
});


router.get('/account/:account_uuid.html', function (req, res, next) {
  res.type('html');

  req.app.services.mongodb.collection('accounts').findOne({ uuid: req.params.account_uuid }, function (error, account) {
    if (error) {
      return next(error);
    }

    if (!account) {
      return res.sendStatus(404); // 404 Not Found
    }

    const store = Redux.createStore(require('../reducers'));

    store.dispatch({
      type: 'ACCOUNT_RECEIVE',
      account: account
    });

    res.send(renderPage(require('../pages/account/Other.jsx'), store));
  });

});

module.exports = router;