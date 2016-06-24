const express = require('express');
const async = require('async');

require('node-jsx').install({extension: '.jsx'});
require('./lib/ignore-style.js').install();

require('dotenv').config({ silent: true});

var app = express();

app.set('port', (process.env.PORT || 5000));

app.services = {};

async.parallel([
  require('./service/redis.js')(app),
  require('./service/mongodb.js')(app)
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
    secret: 'keyboard cat',
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

  const renderPage = require('./lib/page-renderer.js');
  const Redux = require('redux');

  app.get('/', function (req, res, next) {
    var uuid = req.params.uuid;

    const store = Redux.createStore(require('./reducers'));

    res.type('html');
    res.send(renderPage(require('./pages/Home.jsx'), store));
  });

  app.use(require('./route/authorize'));

  app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
  });

});
