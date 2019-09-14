// There are three ways this script can finish:
// 1. The user's credentials are valid.
//     callback(null, profile);
// 2. The user's credentials are invalid
//     callback(new WrongUsernameOrPasswordError(email, "my error message"));
// 3. Something went wrong while trying to reach your database
//     callback(new Error("my error message"));

function login(email, password, callback) {
  const jwt = require('jsonwebtoken@8.5.0');
  const request = require('request@2.81.0');
  const URL = 'https://letsdoauth-api.netlify.com/.netlify/functions/login';

  const optionsSign = {
    issuer: configuration.JWT_ISSUER,
    audience: configuration.JWT_AUDIENCE,
    expiresIn: '10s'
  };

  const token = jwt.sign({}, configuration.JWT_SECRET, optionsSign);

  request.post(
    {
      url: URL,
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        email: email,
        password: password
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

      const user = {
        user_id: body._id.toString(),
        ...body
      };

      callback(null, user);
    }
  );
}
