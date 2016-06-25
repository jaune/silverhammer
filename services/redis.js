var Redis = require('ioredis');

var logger = require('../logger.js');

module.exports = function (app) {

  return function (next) {
    var redis = new Redis({ showFriendlyErrorStack: true });

    redis.on('connect', function () {
      logger.info('redis ::: connect');

      app.services.redis = redis;
      next();
    });

    redis.on('authError', function () {
      logger.error('redis ::: authError');
    });

    redis.on('error', function () {
      logger.error('redis ::: error');
    });
  };

};