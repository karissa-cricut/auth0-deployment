// There are three ways this script can finish:
// 1. A user was successfully found.
//     callback(null, profile);
// 2. A user was not found
//     callback(null);
// 3. Something went wrong while trying to reach your database:
//     callback(new Error("my error message"));

function getUser(email, callback) {
  const request = require('request@2.81.0');
  const url = 'https://letsdoauth-api.netlify.com/.netlify/functions/get-user'; // prettier-ignore

  request.get(
    {
      url: url,
      qs: {
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

      if (!body) {
        callback(null);
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
