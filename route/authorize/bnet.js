const url = require('url');

var passport = require('passport');

module.exports = function (router, authorizeCallback) {
  const clientID = process.env.PASSPORT_BNET_CLIENTID;
  const clientSecret = process.env.PASSPORT_BNET_SECRET;
  const baseUrl = process.env.PUBLIC_BASE_URL;

  if ((typeof clientID !== 'string') || (clientID.length < 2)) {
    return;
  }

  if ((typeof clientSecret !== 'string') || (clientSecret.length < 2)) {
    return;
  }

  if ((typeof baseUrl !== 'string') || (baseUrl.length < 2)) {
    throw Error('Missing env `PUBLIC_BASE_URL`.');
  }

  var parts = url.parse(baseUrl);

  if (!parts.protocol || !parts.host) {
    throw Error('Invlaid env `PUBLIC_BASE_URL`. Must be an URL.');
  }

  var BnetStrategy = require('passport-bnet').Strategy;
  passport.use(new BnetStrategy({
      clientID: clientID,
      clientSecret: clientSecret,
      callbackURL: parts.protocol + '//' + parts.host + '/authorize/bnet/callback'
  }, function(accessToken, refreshToken, profile, next) {
      process.nextTick(function () {
        return next(null, profile);
      });
  }));

  router.get('/authorize/bnet', passport.authorize('bnet'));
  router.get('/authorize/bnet/callback', passport.authorize('bnet'), authorizeCallback);

};