function boostrap(user, context, callback) {
  const ManagementClient = require('auth0@2.17.0').ManagementClient;

  if (!global.management) {
    global.management = new ManagementClient({
      domain: auth0.domain,
      token: auth0.accessToken
    });
  }

  if (!global.isJson) {
    global.isJson = isJson;
  }

  if (!global.requestPostAsync) {
    global.requestPostAsync = requestPostAsync;
  }

  callback(null, user, context);

  function isJson(headers) {
    const contentType = headers['content-type'] || '';
    return contentType.includes('application/json');
  }

  function requestPostAsync(options) {
    return new Promise((resolve, reject) => {
      request.post(options, (err, resp, body) => {
        if (err) {
          reject(err);
          return;
        }
        if (!/^2/.test('' + resp.statusCode)) {
          reject(new Error(JSON.stringify(body)));
          return;
        }
        resolve(body);
      });
    });
  }
}
