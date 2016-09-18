const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;

var logger = require('../logger.js');

module.exports = function (app) {

  return function (next) {
    MongoClient.connect('mongodb://localhost:27017/db', function(error, db) {
      if (error) {
        logger.info('MongoClient ::: Connection fail.');
        return next(error);
      }
      logger.info('MongoClient ::: Connected correctly to server.');

      app.services.mongodb = db;
      next();
    });
  };

};