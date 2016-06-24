const express = require('express');
const uuidv4 = require('uuid').v4;

const renderPage = require('../lib/page-renderer.js');
const renderRedirectPage = require('../lib/redirect-page-renderer.js');
const Redux = require('redux');

var user = express.Router();

require('./authorize/steam.js')(user, authorizeCallback);
require('./authorize/twitchtv.js')(user, authorizeCallback);
require('./authorize/bnet.js')(user, authorizeCallback);
require('./authorize/discord.js')(user, authorizeCallback);

var passport = require('passport');

user.get('/authorize.html', function (req, res) {
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
            res.redirect('/account/' + account.uuid + '.html');
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

// Retrieve authorization from authorization_uuid
user.use('/authorization/:authorization_uuid', function (req, res, next) {
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

user.get('/authorization/:authorization_uuid/form/add-authorization-to-account.html', function (req, res) {
  const store = Redux.createStore(require('../reducers'));

  store.dispatch({
    type: 'AUTHORIZATION_RECEIVE',
    authorization: req.authorization
  });

  res.type('html');
  res.send(renderPage(require('../pages/authorization/AddToAccount.jsx'), store));
});

user.get('/authorization/:authorization_uuid/form/create-account.html', function (req, res) {
  const store = Redux.createStore(require('../reducers'));

  store.dispatch({
    type: 'AUTHORIZATION_RECEIVE',
    authorization: req.authorization
  });

  res.type('html');
  res.send(renderPage(require('../pages/authorization/CreateAccount.jsx'), store));
});

user.get('/authorization/:authorization_uuid/message/:message_key.html', function (req, res) {

  res.send(req.params.message_key + '.html');
});

user.post('/account/@me/authorization/', function (req, res, next) {
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

user.post('/account/', function (req, res, next) {
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



user.get('/account/@me.html', function (req, res, next) {
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

    res.type('html');
    res.send(renderPage(require('../pages/account/Me.jsx'), store));
  });
});


user.get('/account/:account_uuid.html', function (req, res, next) {

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

    res.type('html');
    res.send(renderPage(require('../pages/account/Other.jsx'), store));
  });

});

module.exports = user;