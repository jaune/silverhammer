const express = require('express');
const async = require('async');

var logger = require('./logger.js');

require('node-jsx').install({extension: '.jsx'});
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

  // End
  app.use(function(error, req, res, next) {
    logger.error(error, error.stack);
    res.status(500);

    res.format({
      'text/plain': function(){
        res.send('500 - Internal Server Error.');
      },

      'text/html': function(){
        res.send([
          '<!DOCTYPE html>',
          '<html><head><title>500 - Internal Server Error</title></head><body><h1>500 - Internal Server Error</h1></body></html>'
        ].join('\n'));
      },

      'application/json': function(){
        res.json({ error: '500 - Internal Server Error' });
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
