// There are two ways this script can finish:
// 1. The user was removed successfully:
//     callback(null);
// 2. Something went wrong while trying to reach your database:
//     callback(new Error("my error message"));

async function remove(id, callback) {
  const util = require('util');
  const jwt = require('jsonwebtoken@8.5.0');
  const req = require('request@2.81.0');
  const URL = 'https://letsdoauth-api.netlify.com/.netlify/functions/delete';

  const [deleteAsync, signAsync] = [req.delete, jwt.sign].map(util.promisify);

  const optionsSign = {
    issuer: configuration.JWT_ISSUER,
    audience: configuration.JWT_AUDIENCE,
    expiresIn: '10s'
  };

  const token = await signAsync({}, configuration.JWT_SECRET, optionsSign);

  try {
    const { body, statusCode } = await deleteAsync({
      url: URL,
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        id: id
      },
      json: true
    });

    if (!/^2/.test('' + statusCode)) {
      callback(new Error(body.msg));
      return;
    }

    callback(null);
  } catch (err) {
    if (err) {
      callback(err);
      return;
    }
  }
}
