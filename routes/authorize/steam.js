const url = require('url');

var passport = require('passport');

module.exports = function (router, authorizeCallback) {
  const apiKey = process.env.PASSPORT_STEAM_APIKEY;
  const baseUrl = process.env.PUBLIC_BASE_URL;

  if ((typeof apiKey !== 'string') || (apiKey.length < 2)) {
    return;
  }

  if ((typeof baseUrl !== 'string') || (baseUrl.length < 2)) {
    throw Error('Missing env `PUBLIC_BASE_URL`.');
  }

  var parts = url.parse(baseUrl);

  if (!parts.protocol || !parts.host) {
    throw Error('Invlaid env `PUBLIC_BASE_URL`. Must be an URL.');
  }

  var SteamStrategy = require('passport-steam').Strategy;
  passport.use(new SteamStrategy({
      returnURL: parts.protocol + '//' + parts.host + '/authorize/steam/callback',
      realm: parts.protocol + '//' + parts.host + '/',
      apiKey: apiKey
    },
    function(identifier, profile, next) {
      process.nextTick(function () {
        next(null, profile);
      });
    })
  );

  router.get('/authorize/steam', passport.authorize('steam'));
  router.get('/authorize/steam/callback', passport.authorize('steam'), authorizeCallback);
};
