var Redis = require('ioredis');

module.exports = function (app) {

  return function (next) {
    var redis = new Redis({ showFriendlyErrorStack: true });

    redis.on('connect', function () {
      console.log('redis ::: connect');

      app.services.redis = redis;
      next();
    });

    redis.on('authError', function () {
      console.log('redis ::: authError');
    });

    redis.on('error', function () {
      console.log('redis ::: error');
    });
  };

};