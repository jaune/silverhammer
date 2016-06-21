const express = require('express');
var app = express();

// process.env.PUBLIC_URL = http://localhost/

app.set('port', (process.env.PORT || 5000));

app.use(express.static('web'));

require('node-jsx').install({extension: '.jsx'});

const HomePage = require('./page/Home.jsx');
const renderPage = require('./lib/page-renderer.js');

app.get('/', function (req, res, next) {
  var uuid = req.params.uuid;

  var props = {
    lang: 'fr', // xml:lang
    locale: 'fr_FR', // og:locale
    dir: 'ltr',
    title: 'title',
    content: 'content'
  };

  res.type('html');
  res.send(renderPage('Home', HomePage, props));
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});