const express = require('express');

var router = express.Router();

const renderPage = require('../lib/entry-renderer.js');
const Redux = require('redux');

const i = require('../lib/initiate-state.js');

router.get('/', [i.initiateState, i.initiateStateRouter, i.initiateStateSessionAccountFromSession], function (req, res, next) {
  res.type('html');

  var store = Redux.createStore(require('../reducers'), req.initialState);

  res.send(renderPage(require('../components/entry/Default.jsx'), store, req.app.services.router));
});

module.exports = router;