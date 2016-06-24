const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;

module.exports = function (app) {

  return function (next) {
    MongoClient.connect('mongodb://localhost:27017/db', function(error, db) {
      if (error) {
        return next(error);
      }
      console.log('MongoClient ::: Connected correctly to server');

      app.services.mongodb = db;
      next();
    });
  };

};