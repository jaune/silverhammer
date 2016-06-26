const express = require('express');
const uuidv4 = require('uuid').v4;

const renderPage = require('../lib/page-renderer.js');
const renderRedirectPage = require('../lib/redirect-page-renderer.js');
const Redux = require('redux');

var router = express.Router();

require('./authorize/steam.js')(router, authorizeCallback);
require('./authorize/twitchtv.js')(router, authorizeCallback);
require('./authorize/bnet.js')(router, authorizeCallback);
require('./authorize/discord.js')(router, authorizeCallback);

var passport = require('passport');

router.get('/authorize.html', function (req, res) {
  const store = Redux.createStore(require('../reducers'));

  store.dispatch({
    type: 'PASSPORTS_RECEIVE',
    passports: ['steam', 'twitchtv', 'bnet', 'discord'].map(function (key) {
      return {
        url: process.env.PUBLIC_BASE_URL + '/authorize/' + key
      };
    })
  });

  res.type('html');
  res.send(renderPage(require('../pages/Authorize.jsx'), store));
});


function authorizeCallback(req, res, next) {
  var app = req.app;
  var authorization_uuid = uuidv4();
  var data = {
    uuid: authorization_uuid,
    session_id: req.session.id,
    authorization: req.account
  };
  var authorization_key = 'authorization/' + authorization_uuid;

  app.services.redis.set('authorization/' + authorization_uuid, JSON.stringify(data), function (error) {
    if (error) {
      return next(error);
    }

    var query = {
      authorizations: {
        $elemMatch: {
          id: data.authorization.id
        }
      }
    };

    app.services.mongodb.collection('accounts').findOne(query, function(error, account) {
      if (error) {
        return next(error);
      }

      if (req.session.user) {
        if (account) {
          if (account.uuid === req.session.user.account_uuid) {
            res.redirect('/authorization/' + authorization_uuid + '/message/already-attach-to-this-account.html');
            return next();
          } else {
            res.redirect('/authorization/' + authorization_uuid + '/message/already-attach-to-an-other-account.html');
            return next();
          }
        } else {
          res.redirect('/authorization/' + authorization_uuid + '/form/add-authorization-to-account.html');
          return next();
        }
      } else {
        if (account) {
          // Create session.
          req.session.user = {
            account_uuid: account.uuid
          };

          req.session.save(function(error) {
            if (error) {
              app.services.redis.delete(authorization_uuid); // async
              return next(error);
            }
            res.redirect('/account/@me.html');
          });
          return;
        } else {
          res.redirect('/authorization/' + authorization_uuid + '/form/create-account.html');
          return next();
        }
      }
    });
  });
}


module.exports = router;