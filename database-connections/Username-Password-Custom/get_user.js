// There are three ways this script can finish:
// 1. A user was successfully found.
//    callback(null, profile);
// 2. A user was not found
//    callback(null);
// 3. Something went wrong while trying to reach your database:
//    callback(new Error("my error message"));

async function getUser(email, callback) {
  const util = require('util');
  const jwt = require('jsonwebtoken@8.5.0');
  const req = require('request@2.81.0');

  const BASE_URL = 'https://letsdoauth-api.herokuapp.com';

  const CONFIG = {
    JWT_AUDIENCE: '##JWT_AUDIENCE##',
    JWT_ISSUER: '##JWT_ISSUER##',
    JWT_SECRET: '##JWT_SECRET##'
  };

  const [getAsync, signAsync] = [req.get, jwt.sign].map(util.promisify);

  try {
    const jwt = await signAsync({}, CONFIG.JWT_SECRET, {
      issuer: CONFIG.JWT_ISSUER,
      audience: CONFIG.JWT_AUDIENCE,
      expiresIn: 10
    });

    const { body, statusCode } = await getAsync({
      url: `${BASE_URL}/api/custom-db/get-user`,
      headers: {
        Authorization: `Bearer ${jwt}`
      },
      qs: {
        email: email
      },
      json: true
    });

    if (!/^2/.test('' + statusCode)) {
      callback(new Error(body.msg));
      return;
    }

    if (!body) {
      callback(null);
      return;
    }

    const user = {
      user_id: body._id.toString(),
      ...body
    };

    callback(null, user);
  } catch (err) {
    callback(err);
  }
}
