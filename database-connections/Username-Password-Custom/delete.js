// There are two ways this script can finish:
// 1. The user was removed successfully:
//    callback(null);
// 2. Something went wrong while trying to reach your database:
//    callback(new Error("my error message"));

async function remove(id, callback) {
  const fetch = require('node-fetch@2.6.0');
  const { URL } = require('url');

  const CONFIG = {
    DOMAIN_API: '##DOMAIN_API##',
    DOMAIN_AUTH0: '##DOMAIN_AUTH0##',
    JWT_AUDIENCE: '##JWT_AUDIENCE##',
    JWT_CLIENT_ID: '##JWT_CLIENT_ID##',
    JWT_CLIENT_SECRET: '##JWT_CLIENT_SECRET##'
  };

  try {
    const jwt = await requestJwt();

    const url = new URL(
      `https://${CONFIG.DOMAIN_API}/api/databases/users/${id}`
    );

    const res = await fetch(url, {
      method: 'DELETE',
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

    callback(null);
  } catch (err) {
    callback(err);
  }

  async function requestJwt() {
    const url = new URL(`https://${CONFIG.DOMAIN_AUTH0}/oauth/token`);

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
