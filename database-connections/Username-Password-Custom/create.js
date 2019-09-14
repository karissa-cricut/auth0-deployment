// There are three ways this script can finish:
// 1. A user was successfully created:
//     callback(null);
// 2. This user already exists in your database
//     callback(new ValidationError("user_exists", "my error message"));
// 3. Something went wrong while trying to reach your database:
//     callback(new Error("my error message"));

async function create(user, callback) {
  const util = require('util');
  const jwt = require('jsonwebtoken@8.5.0');
  const req = require('request@2.81.0');

  const NETLIFY = 'https://letsdoauth-api.netlify.com/.netlify/functions';

  const [postAsync, signAsync] = [req.post, jwt.sign].map(util.promisify);

  const optionsSign = {
    issuer: configuration.JWT_ISSUER,
    audience: configuration.JWT_AUDIENCE,
    expiresIn: '10s'
  };

  const token = await signAsync({}, configuration.JWT_SECRET, optionsSign);

  try {
    const { body, statusCode } = await postAsync({
      url: `${NETLIFY}/create`,
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: user,
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

    callback(null);
  } catch (err) {
    if (err) {
      callback(err);
      return;
    }
  }
}
