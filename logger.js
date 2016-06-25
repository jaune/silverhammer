var winston = require('winston');

var logger = new winston.Logger({
  level: process.env.LOGGER_LEVEL || 'info',
  transports: [
    new winston.transports.Console({
      colorize: true
    })
  ]
});

module.exports = logger;