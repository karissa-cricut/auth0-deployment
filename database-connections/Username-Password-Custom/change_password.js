// There are three ways this script can finish:
// 1. The user's password was updated successfully:
//    callback(null, true);
// 2. The user's password was not updated:
//    callback(null, false);
// 3. Something went wrong while trying to reach your database:
//    callback(new Error("my error message"));

async function changePassword(email, newPassword, callback) {
  const util = require('util');
  const req = require('request@2.81.0');

  const BASE_URL = 'https://letsdoauth-api.herokuapp.com';

  const [patchAsync, postAsync] = [req.patch, req.post].map(util.promisify);

  try {
    const jwt = await requestJwt();

    const { body, statusCode } = await patchAsync({
      url: `${BASE_URL}/api/custom-db/change-password`,
      headers: {
        Authorization: `Bearer ${jwt}`
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
    callback(err);
  }

  async function requestJwt() {
    const CONFIG = {
      AUTH0_DOMAIN: '##AUTH0_DOMAIN##',
      JWT_AUDIENCE: '##JWT_AUDIENCE##',
      JWT_CLIENT_ID: '##JWT_CLIENT_ID##',
      JWT_CLIENT_SECRET: '##JWT_CLIENT_SECRET##'
    };

    const { body, statusCode } = await postAsync({
      url: `https://${CONFIG.AUTH0_DOMAIN}/oauth/token`,
      body: {
        grant_type: 'client_credentials',
        client_id: CONFIG.JWT_CLIENT_ID,
        client_secret: CONFIG.JWT_CLIENT_SECRET,
        audience: CONFIG.JWT_AUDIENCE
      },
      json: true
    });

    return body.access_token;
  }
}
