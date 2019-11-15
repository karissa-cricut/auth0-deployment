const helpers = require('./helpers');

exports.handler = async (event, context) => {
  //Get contents of response
  const response = event.Records[0].cf.response;
  const headers = response.headers;

  const o = {
    'frame-ancestors': [
      'http://localhost:3000',
      'https://letsdoauth-app.herokuapp.com'
    ],
    'default-src': ["'self'", 'https://rudydahbura.guardian.auth0.com'],
    'img-src': [
      "'self'",
      'data:',
      'https://cdn.auth0.com',
      'https://secure.gravatar.com'
    ],
    'script-src': [
      "'self'",
      "'unsafe-inline'",
      'https://cdn.auth0.com',
      'https://secure.gravatar.com'
    ],
    'style-src': ["'self'", "'unsafe-inline'", 'https://cdn.auth0.com']
  };

  //Set new headers
  headers['content-security-policy'] = [
    {
      key: 'Content-Security-Policy',
      value: helpers.createCsp(o)
    }
  ];
  headers['x-frame-options'] = [
    {
      key: 'X-Frame-Options',
      value:
        'allow-from http://localhost:3000 https://letsdoauth-app.herokuapp.com'
    }
  ];

  //Return modified response
  return response;
};
