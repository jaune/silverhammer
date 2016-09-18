const express = require('express');
const i = require('../../lib/initiate-state.js');
const Redux = require('redux');
const renderPage = require('../../lib/entry-renderer.js');

var router = express.Router();


router.get('/checkers/game/:game_uuid.html', [i.initiateState, i.initiateStateRouter, i.initiateStateSessionAccountFromSession], function (req, res, next) {
  var store = Redux.createStore(require('../../reducers'), req.initialState);

  res.type('html');
  res.send(renderPage(require('../../components/entry/Default.jsx'), store, req.app.services.router));
});

module.exports = router;