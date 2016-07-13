const express = require('express');
const async = require('async');

var logger = require('./logger.js');

require('babel-register')({extensions: ['.jsx']});
require('./lib/ignore-style.js').install();

require('dotenv').config({ silent: true});

var app = express();

app.set('port', (process.env.PORT || 5000));

app.services = {};

async.parallel([
  require('./services/redis.js')(app),
  require('./services/mongodb.js')(app)
], function (error) {
  if (error) {
    throw error;
  }

  const createRouter = require('./lib/router/createRouter.js');

  app.services.router = createRouter({
    base: process.env.PUBLIC_BASE_URL,
    routes: [
      {
        pattern: '/',
        virtual: true
      },
      {
        pattern: '/authorize.html',
        virtual: true
      },
      {
        pattern: '/authorization/:authorization_uuid/form/create-account.html',
        virtual: true
      },
      {
        pattern: '/account/@me.html',
        virtual: true
      },

      {
        pattern: '/lobby/:lobby_uuid.html',
        virtual: true
      }
    ]
  });

  var passport = require('passport');

  var session = require('express-session');
  var RedisStore = require('connect-redis')(session);

  app.use(express.static('web'));

  app.use(require('cookie-parser')());
  app.use(require('body-parser').urlencoded({ extended: true }));
  app.use(session({
    secret: process.env.SESSION_SECRET || 'session/secret',
    resave: true,
    saveUninitialized: true,
    store: new RedisStore({
      client: app.services.redis,
      ttl: 60 * 60,
      prefix: 'session/'
    })
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(require('./routes/home.js'));
  app.use(require('./routes/authorize.js'));
  app.use(require('./routes/authorization.js'));
  app.use(require('./routes/account.js'));
  app.use(require('./routes/session.js'));
  app.use(require('./routes/lobby.js'));

  // End
  app.use(function(error, req, res, next) {
    logger.error(error);
    res.status(500);

    res.format({
      'text/plain': function(){
        res.send('500 - Internal Server Error.');
      },

      'text/html': function(){
        res.send([
          '<!DOCTYPE html>',
          '<html><head><title>500 - Internal Server Error</title></head><body><h1>500 - Internal Server Error</h1><h2>' + error + '</h2><pre>' + error.stack + '</pre></body></html>'
        ].join('\n'));
      },

      'application/json': function(){
        res.json({ error: '500 - Internal Server Error', message: error });
      },

      'default': function() {
        res.send('500 - Internal Server Error.');
      }
    });
    return next();
  });

  app.listen(app.get('port'), function() {
    logger.info('Node app is running on port', app.get('port'));
  });

});
