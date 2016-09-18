const express = require('express');
const uuidv4 = require('uuid').v4;

const renderPage = require('../lib/entry-renderer.js');
const renderRedirectPage = require('../lib/redirect-page-renderer.js');
const Redux = require('redux');
const createFetcher = require('../lib/fetcher/createFetcher.js');

const React = require('react');
const ReactDOMServer = require('react-dom/server');

const async = require('async');

var router = express.Router();

require('./authorize/steam.js')(router, authorizeCallback);
require('./authorize/twitchtv.js')(router, authorizeCallback);
require('./authorize/bnet.js')(router, authorizeCallback);
require('./authorize/discord.js')(router, authorizeCallback);

var passport = require('passport');

const i = require('../lib/initiate-state.js');


router.get('/passport/', function (req, res) {
  var passports = ['steam', 'twitchtv', 'bnet', 'discord'].map(function (key) {
    return {
      key: key,
      url: process.env.PUBLIC_BASE_URL + '/authorize/' + key
    };
  });

  res.json(passports);
});


router.get('/authorize.html', [i.initiateState, i.initiateStateRouter, i.initiateStateSessionAccountFromSession], function (req, res, next) {
  var store = Redux.createStore(require('../reducers'), req.initialState);
  var fetcher = createFetcher();

  fetcher.startRecord();

  var content = ReactDOMServer.renderToString(React.createElement(require('../components/entry/Default.jsx'), { store: store, router: req.app.services.router, fetcher: fetcher }));

  var record = fetcher.stopRecord();

  record = record.reduce(function (result, value) {
    if (Array.isArray(value)) {
      return result.concat(value);
    }
    result.push(value);

    return result;
  }, []);

  async.eachLimit(
    record, 10,
    function loop (pattern, done) {

      switch (pattern) {
        case 'collections.passport.*':
          (function () {
            var passports = ['steam', 'twitchtv', 'bnet', 'discord'].map(function (key) {
              return {
                key: key,
                url: process.env.PUBLIC_BASE_URL + '/authorize/' + key
              };
            });

            store.dispatch({
              type: 'fetcher/RECEIVE',
              pattern: 'collections.passport.*',
              items: passports
            });
            return done();
          })();
          return;
        break;
      }
      return done();
    },
    function done (error) {
      if (error) {
        return next(error);
      }

      content = ReactDOMServer.renderToString(React.createElement(require('../components/entry/Default.jsx'), { store: store, router: req.app.services.router, fetcher: fetcher }));

      res.type('html');
      res.send(renderPage(require('../components/entry/Default.jsx'), store, req.app.services.router, content));
      return next();
    }
  );



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