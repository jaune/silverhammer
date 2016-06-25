const express = require('express');
const HomePage = require('../pages/Home.jsx');

var router = express.Router();

const renderPage = require('../lib/page-renderer.js');
const Redux = require('redux');

router.get('/', function (req, res, next) {
  res.type('html');

  var store = Redux.createStore(require('../reducers'));

  var account_uuid;

  try {
    account_uuid = req.session.user.account_uuid;
  } catch (error) {
  }

  if (!account_uuid) {
    res.send(renderPage(HomePage, store));
    return;
  }

  req.app.services.mongodb.collection('accounts').findOne({ uuid: account_uuid }, function (error, account) {
    if (error) {
      return next(error);
    }

    if (account) {
      store.dispatch({
        type: 'SESSION_ACCOUNT',
        account: {
          uuid: account.uuid,
          label: account.displayName
        }
      });
    };

    res.send(renderPage(HomePage, store));
  });

});

module.exports = router;