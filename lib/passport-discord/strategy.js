/**
 * Module dependencies.
 */
var util = require('util');
var OAuth2Strategy = require('passport-oauth2');
var InternalOAuthError = require('passport-oauth2').InternalOAuthError;
var async = require('async');

function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://discordapp.com/api/oauth2/authorize';
  options.tokenURL = options.tokenURL || 'https://discordapp.com/api/oauth2/token';
  options.scope = options.scope || ['identify'];
  options.scopeSeparator = options.scopeSeparator || ' ';
  options.customHeaders = options.customHeaders || {};

  OAuth2Strategy.call(this, options, verify);
  if(!options.clientSecret){
    throw new TypeError('OAuth2Strategy requires a clientSecret option');
  }
  this.name = 'discord';
  this._profileUrl = options.userURL || 'https://discordapp.com/api/users/@me';
  this._oauth2.useAuthorizationHeaderforGET(true);
}

util.inherits(Strategy, OAuth2Strategy);

Strategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2.get(this._profileUrl, accessToken, function (err, body, res) {
    var json;

    if (err) {
      return done(new InternalOAuthError('Failed to fetch the user id', err));
    }

    try {
      json = JSON.parse(body);
    } catch (ex) {
      return done(new Error('Failed to parse the user id'));
    }

    var profile = json;
    profile.provider = 'discord';
    profile.token = accessToken;

    return done(null, profile);
  });
};

module.exports = Strategy;