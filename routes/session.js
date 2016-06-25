const express = require('express');

const renderRedirectPage = require('../lib/redirect-page-renderer.js');

var router = express.Router();

router.delete('/session/@me', function (req, res, next) {
  res.type('json');

  req.logout();
  req.session.destroy(function(error) {
    if (error) {
      return next(error);
    }
    res.json({});
  });
});

module.exports = router;