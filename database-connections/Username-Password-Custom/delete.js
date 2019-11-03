// There are two ways this script can finish:
// 1. The user was removed successfully:
//    callback(null);
// 2. Something went wrong while trying to reach your database:
//    callback(new Error("my error message"));

async function remove(id, callback) {
  const util = require('util');
  const req = require('request@2.81.0');

  const BASE_URL = 'https://letsdoauth-api.herokuapp.com';

  const [deleteAsync, postAsync] = [req.delete, req.post].map(util.promisify);

  try {
    const jwt = await requestJwt();

    const { body, statusCode } = await deleteAsync({
      url: `${BASE_URL}/api/custom-db/delete`,
      headers: {
        Authorization: `Bearer ${jwt}`
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
