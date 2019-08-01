// There are two ways this script can finish:
// 1. The user's email was verified successfully
//     callback(null, true);
// 2. Something went wrong while trying to reach your database:
//     callback(new Error("my error message"));

function verify(email, callback) {
  const request = require('request@2.81.0');
  const url = 'https://letsdoauth-api.netlify.com/.netlify/functions/verify';

  request.patch(
    {
      url: url,
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
