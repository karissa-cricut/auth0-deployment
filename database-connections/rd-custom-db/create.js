// There are three ways this script can finish:
// 1. A user was successfully created:
//     callback(null);
// 2. This user already exists in your database
//     callback(new ValidationError("user_exists", "my error message"));
// 3. Something went wrong while trying to reach your database:
//     callback(new Error("my error message"));

function create(user, callback) {
  const request = require('request@2.81.0');
  const url = 'https://letsdoauth-api.netlify.com/.netlify/functions/create';

  request.post(
    {
      url: url,
      body: user,
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

      callback(null);
    }
  );
}
