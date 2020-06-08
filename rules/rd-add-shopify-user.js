async function addShopifyUser(user, context, callback) {
  const fetch = require('node-fetch@2.6.0');
  const { URL } = require('url');

  const CONFIG = {
    API_KEY: '##SHOPIFY_API_KEY##',
    API_PWD: '##SHOPIFY_API_PWD##',
    API_URL: '##SHOPIFY_API_URL##'
  };

  try {
    const url = new URL(
      `https://${CONFIG.API_KEY}:${CONFIG.API_PWD}@${CONFIG.API_URL}/admin/api/2020-04/customers.json`
    );

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        customer: {
          first_name: user.given_name,
          last_name: user.family_name,
          email: user.email,
          verified_email: user.email_verified
        }
      })
    });

    const body = await res.text();

    if (!res.ok) {
      callback(new Error(body));
      return;
    }

    callback(null, user, context);
  } catch (err) {
    callback(err);
  }
}
