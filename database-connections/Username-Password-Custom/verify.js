// There are two ways this script can finish:
// 1. The user's email was verified successfully
//     callback(null, true);
// 2. Something went wrong while trying to reach your database:
//     callback(new Error("my error message"));

function verify(email, callback) {
  const jwt = require('jsonwebtoken@8.5.0');
  const request = require('request@2.81.0');
  const URL = 'https://letsdoauth-api.netlify.com/.netlify/functions/verify';

  const optionsSign = {
    issuer: configuration.JWT_ISSUER,
    audience: configuration.JWT_AUDIENCE,
    expiresIn: '10s'
  };

  const token = jwt.sign({}, configuration.JWT_SECRET, optionsSign);

  request.patch(
    {
      url: URL,
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        email: email
      },
      json: true
    },
    (err, res, body) => {
      if (err) {
        callback(err);
        return;
      }

      if (!/^2/.test('' + res.statusCode)) {
        callback(new Error(body.msg));
        return;
      }

      callback(null, true);
    }
  );
}
