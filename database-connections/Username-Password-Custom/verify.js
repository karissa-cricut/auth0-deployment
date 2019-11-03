// There are two ways this script can finish:
// 1. The user's email was verified successfully
//    callback(null, true);
// 2. Something went wrong while trying to reach your database:
//    callback(new Error("my error message"));

async function verify(email, callback) {
  const util = require('util');
  const jwt = require('jsonwebtoken@8.5.0');
  const req = require('request@2.81.0');

  const BASE_URL = 'https://letsdoauth-api.herokuapps.com';

  const CONFIG = {
    JWT_AUDIENCE: '##JWT_AUDIENCE##',
    JWT_ISSUER: '##JWT_ISSUER##',
    JWT_SECRET: '##JWT_SECRET##'
  };

  const [patchAsync, signAsync] = [req.patch, jwt.sign].map(util.promisify);

  try {
    const jwt = await signAsync({}, CONFIG.JWT_SECRET, {
      issuer: CONFIG.JWT_ISSUER,
      audience: CONFIG.JWT_AUDIENCE,
      expiresIn: 10
    });

    const { body, statusCode } = await patchAsync({
      url: `${BASE_URL}/api/custom-db/verify`,
      headers: {
        Authorization: `Bearer ${jwt}`
      },
      body: {
        email: email
      },
      json: true
    });

    if (!/^2/.test('' + statusCode)) {
      callback(new Error(body.msg));
      return;
    }

    callback(null, true);
  } catch (err) {
    callback(err);
  }
}
