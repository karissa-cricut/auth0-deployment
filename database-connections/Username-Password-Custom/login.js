// There are three ways this script can finish:
// 1. The user's credentials are valid.
//    callback(null, profile);
// 2. The user's credentials are invalid
//    callback(new WrongUsernameOrPasswordError(email, "my error message"));
// 3. Something went wrong while trying to reach your database
//    callback(new Error("my error message"));

async function login(email, password, callback) {
  const util = require('util');
  const jwt = require('jsonwebtoken@8.5.0');
  const req = require('request@2.81.0');

  const BASE_URL = 'https://letsdoauth-api.netlify.com';

  const [postAsync, signAsync] = [req.post, jwt.sign].map(util.promisify);

  try {
    const token = await signAsync({}, configuration.JWT_SECRET, {
      issuer: configuration.JWT_ISSUER,
      audience: configuration.JWT_AUDIENCE,
      expiresIn: '10s'
    });

    const { body, statusCode } = await postAsync({
      url: `${BASE_URL}/.netlify/functions/login`,
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        email: email,
        password: password
      },
      json: true
    });

    if (!/^2/.test('' + statusCode)) {
      callback(new Error(body.msg));
      return;
    }

    const user = {
      user_id: body._id.toString(),
      ...body
    };

    callback(null, user);
  } catch (err) {
    callback(err);
  }
}
