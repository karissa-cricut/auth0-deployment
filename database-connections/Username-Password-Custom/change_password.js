// There are three ways this script can finish:
// 1. The user's password was updated successfully:
//    callback(null, true);
// 2. The user's password was not updated:
//    callback(null, false);
// 3. Something went wrong while trying to reach your database:
//    callback(new Error("my error message"));

async function changePassword(email, newPassword, callback) {
  const fetch = require('node-fetch@2.6.0');
  const { URL } = require('url');

  const BASE_URL = 'https://letsdoauth-api.herokuapp.com';

  try {
    const jwt = await requestJwt();

    const url = new URL(`${BASE_URL}/api/databases/users/${email}/password`);

    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: newPassword
      })
    });

    const body = await res.text();

    if (!res.ok) {
      const error = JSON.parse(body);
      callback(new Error(error.message));
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
