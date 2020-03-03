// There are three ways this script can finish:
// 1. A user was successfully found.
//    callback(null, profile);
// 2. A user was not found
//    callback(null);
// 3. Something went wrong while trying to reach your database:
//    callback(new Error("my error message"));

async function getUser(email, callback) {
  const fetch = require('node-fetch@2.6.0');
  const { URL } = require('url');

  const BASE_URL = 'https://letsdoauth-api.herokuapp.com';

  try {
    const jwt = await requestJwt();

    const url = new URL(`${BASE_URL}/api/databases/users/${email}`);

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });

    const body = await res.text();

    if (!res.ok) {
      const error = JSON.parse(body);
      callback(new Error(error.message));
      return;
    }

    if (body.length === 0) {
      callback(null);
      return;
    }

    const user = JSON.parse(body);
    user.user_id = user._id.toString();

    callback(null, user);
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

    const res = await fetch(url, {
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

    const body = await res.json();

    return body.access_token;
  }
}
