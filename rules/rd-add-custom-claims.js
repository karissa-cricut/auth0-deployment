function addCustomClaims(user, context, callback) {
  const NS = 'https://letsdoauth.com';

  const {
    authorization: { roles = [] },
    connection = '',
    connectionStrategy = '',
    request: {
      geoip: {
        continent_code: continentCode = '',
        country_name: countryName = '',
        time_zone: timeZone = ''
      }
    }
  } = context;

  context.accessToken[`${NS}/roles`] = roles;

  context.idToken[`${NS}/connection`] = connection;
  context.idToken[`${NS}/connectionStrategy`] = connectionStrategy;
  context.idToken[`${NS}/continent`] = continentCode;
  context.idToken[`${NS}/country`] = countryName;
  context.idToken[`${NS}/timezone`] = timeZone;

  callback(null, user, context);
}
