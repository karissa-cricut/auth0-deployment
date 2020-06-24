function addCustomClaims(user, context, callback) {
  const NS = 'https://letsdoauth.com';

  const {
    authorization: { roles = [] },
    connection = '',
    connectionStrategy = '',
    request: {
      geoip: { continent_code = '', country_name = '', time_zone = '' }
    }
  } = context;

  context.idToken[`${NS}/connection`] = connection;
  context.idToken[`${NS}/connectionStrategy`] = connectionStrategy;
  context.idToken[`${NS}/continent`] = continent_code;
  context.idToken[`${NS}/country`] = country_name;
  context.idToken[`${NS}/roles`] = roles;
  context.idToken[`${NS}/timezone`] = time_zone;

  callback(null, user, context);
}
