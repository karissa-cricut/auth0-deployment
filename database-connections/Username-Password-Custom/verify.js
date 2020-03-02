// There are two ways this script can finish:
// 1. The user's email was verified successfully
//    callback(null, true);
// 2. Something went wrong while trying to reach your database:
//    callback(new Error("my error message"));

async function verify(email, callback) {
  const fetch = require('node-fetch@2.6.0');
  const { URL } = require('url');

  const BASE_URL = 'https://letsdoauth-api.herokuapp.com';

  try {
    const jwt = await requestJwt();

    const url = new URL(`${BASE_URL}/api/databases/users/${email}/verify`);

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email
      })
    });

    const body = await response.json();
    const statusCode = response.status;

    if (!/^2/.test('' + statusCode)) {
      callback(new Error(body.message));
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

    const url = new URL(`https://${CONFIG.AUTH0_DOMAIN}/oauth/token`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: CONFIG.JWT_CLIENT_ID,
        client_secret: CONFIG.JWT_CLIENT_SECRET,
        audience: CONFIG.JWT_AUDIENCE
      })
    });

    const body = await response.json();
    const statusCode = response.status;

    return body.access_token;
  }
}
