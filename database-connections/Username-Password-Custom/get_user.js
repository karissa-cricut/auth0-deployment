// There are three ways this script can finish:
// 1. A user was successfully found.
//     callback(null, profile);
// 2. A user was not found
//     callback(null);
// 3. Something went wrong while trying to reach your database:
//     callback(new Error("my error message"));

async function getUser(email, callback) {
  const util = require('util');
  const jwt = require('jsonwebtoken@8.5.0');
  const req = require('request@2.81.0');
  const URL = 'https://letsdoauth-api.netlify.com/.netlify/functions/get-user';

  const [getAsync, signAsync] = [req.get, jwt.sign].map(util.promisify);

  const optionsSign = {
    issuer: configuration.JWT_ISSUER,
    audience: configuration.JWT_AUDIENCE,
    expiresIn: '10s'
  };

  const token = await signAsync({}, configuration.JWT_SECRET, optionsSign);

  try {
    const { body, statusCode } = await getAsync({
      url: URL,
      headers: {
        Authorization: `Bearer ${token}`
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
    if (err) {
      callback(err);
      return;
    }
  }
}
