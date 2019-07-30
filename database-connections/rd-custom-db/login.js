// There are three ways this script can finish:
// 1. The user's credentials are valid.
//     callback(null, profile);
// 2. The user's credentials are invalid
//     callback(new WrongUsernameOrPasswordError(email, "my error message"));
// 3. Something went wrong while trying to reach your database
//     callback(new Error("my error message"));

function login(email, password, callback) {
  const request = require('request@2.81.0');
  const url = 'https://letsdoauth-api.netlify.com/.netlify/functions/login'; // prettier-ignore

  request.post(
    {
      url: url,
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
