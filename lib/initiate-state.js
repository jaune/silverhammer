function initiateState(req, res, next) {
  req.initialState = {};
  return next();
}

function initiateStateRouter(req, res, next) {
  req.initialState.router = req.app.services.router.resolve(req.baseUrl + req.path)
  return next();
}

function initiateStateSessionAccountFromSession(req, res, next) {
  var account_uuid;

  try {
    account_uuid = req.session.user.account_uuid;
  } catch (error) {
  }

  if (!account_uuid) {
    return next();
  }

  req.app.services.mongodb.collection('accounts').findOne({ uuid: account_uuid }, function (error, account) {
    if (error) {
      return next(error);
    }

    if (account) {
      req.initialState.session = req.initialState.session || {};
      req.initialState.session.account = {
        uuid: account.uuid,
        displayName: account.displayName,
        lobbies: []
      }
    }

    req.app.services.mongodb.collection('lobbies').findOne({ id: account._id }, function (error, account) {
    });

    return next();
  });
}

function initiateStateAuthorizationFromParams(req, res, next) {
  var authorization_uuid = req.params.authorization_uuid;
  var authorization_key = 'authorization/' + authorization_uuid;

  if (typeof authorization_uuid !== 'string') {
    return res.sendStatus(400); // 400 Bad Request
  }

  req.app.services.redis.get(authorization_key, function (error, value) {
    if (error) {
      return next(error);
    }

    var data;

    try {
      data = JSON.parse(value);
    } catch (error) {
    }

    if (!data) {
      return res.sendStatus(404); // 404 Not Found
    }

    if (data.session_id !== req.session.id) {
      return res.sendStatus(403); // 403 Forbidden
    }

    req.initialState.collections = req.initialState.collections || {};
    req.initialState.collections.authorization = req.initialState.collections.authorization || {};
    req.initialState.collections.authorization[authorization_uuid] = data;

    return next();
  });
};

function initiateStateConstantsPassports(req, res, next) {
  var passports = ['steam', 'twitchtv', 'bnet', 'discord'].reduce(function (result, key) {
    result[key] = {
      key: key,
      url: process.env.PUBLIC_BASE_URL + '/authorize/' + key
    };
    return result;
  }, {});

  req.initialState.constants = req.initialState.constants || {};

  req.initialState.constants.passports = passports;
  return next();
}


function initiateStateAccountFromSession(req, res, next) {
  var account_uuid;

  try {
    account_uuid = req.session.user.account_uuid;
  } catch (error) {
  }

  if (!account_uuid) {
    return res.sendStatus(401); // 401 Unauthorized
  }

  req.app.services.mongodb.collection('accounts').findOne({ uuid: account_uuid }, function (error, account) {
    if (error) {
      return next(error);
    }

    if (!account) {
      return res.sendStatus(404); // 404 Not Found
    }

    req.initialState.collections = req.initialState.collections || {};
    req.initialState.collections.account = req.initialState.collections.account || {};
    req.initialState.collections.account[account_uuid] = account;

    return next();
  });
}

function initiateStateAccountFromParams(req, res, next) {
  var account_uuid = req.params.account_uuid;

  req.app.services.mongodb.collection('accounts').findOne({ uuid: account_uuid }, function (error, account) {
    if (error) {
      return next(error);
    }

    if (!account) {
      return res.sendStatus(404); // 404 Not Found
    }

    req.initialState.collections = req.initialState.collections || {};
    req.initialState.collections.account = req.initialState.collections.account || {};
    req.initialState.collections.account[account_uuid] = account;

    return next();
  });
}

function initiateStateCollectionLobbyFromParams(req, res, next) {
  var lobby_uuid = req.params.lobby_uuid;

  if (typeof lobby_uuid !== 'string') {
    return res.sendStatus(400); // 400 Bad Request
  }

  req.app.services.mongodb.collection('lobbies').findOne({ uuid: lobby_uuid }, function (error, lobby) {
    if (error) {
      return next(error);
    }

    if (!lobby) {
      return res.sendStatus(404); // 404 Not Found
    }

    req.initialState.collections = req.initialState.collections || {};
    req.initialState.collections.lobby = req.initialState.collections.lobby || {};
    req.initialState.collections.lobby[lobby_uuid] = lobby;

    next();
  });
}



module.exports = {
  initiateState: initiateState,
  initiateStateRouter: initiateStateRouter,
  initiateStateSessionAccountFromSession: initiateStateSessionAccountFromSession,
  initiateStateConstantsPassports: initiateStateConstantsPassports,
  initiateStateAuthorizationFromParams: initiateStateAuthorizationFromParams,
  initiateStateAccountFromSession: initiateStateAccountFromSession,
  initiateStateAccountFromParams: initiateStateAccountFromParams,
  initiateStateCollectionLobbyFromParams: initiateStateCollectionLobbyFromParams
}
