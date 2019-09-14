// There are three ways this script can finish:
// 1. The user's password was updated successfully:
//     callback(null, true);
// 2. The user's password was not updated:
//     callback(null, false);
// 3. Something went wrong while trying to reach your database:
//     callback(new Error("my error message"));

async function changePassword(email, newPassword, callback) {
  const util = require('util');
  const jwt = require('jsonwebtoken@8.5.0');
  const req = require('request@2.81.0');
  const URL =
    'https://letsdoauth-api.netlify.com/.netlify/functions/change-password';

  const [patchAsync, signAsync] = [req.patch, jwt.sign].map(util.promisify);

  const optionsSign = {
    issuer: configuration.JWT_ISSUER,
    audience: configuration.JWT_AUDIENCE,
    expiresIn: '10s'
  };

  const token = await signAsync({}, configuration.JWT_SECRET, optionsSign);

  try {
    const { body, statusCode } = await patchAsync({
      url: URL,
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        email: email,
        password: newPassword
      },
      json: true
    });

    if (!/^2/.test('' + statusCode)) {
      callback(new Error(body.msg));
      return;
    }

    callback(null, true);
  } catch (err) {
    if (err) {
      callback(err);
      return;
    }
  }
}
