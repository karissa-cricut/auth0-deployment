// There are three ways this script can finish:
// 1. A user was successfully found.
//    callback(null, profile);
// 2. A user was not found
//    callback(null);
// 3. Something went wrong while trying to reach your database:
//    callback(new Error("my error message"));

async function getUser(email, callback) {
  const util = require('util');
  const req = require('request@2.81.0');

  const BASE_URL = 'https://letsdoauth-api.herokuapp.com';

  const [getAsync, postAsync] = [req.get, req.post].map(util.promisify);

  try {
    const jwt = await createJwt();

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

  async function createJwt() {
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
