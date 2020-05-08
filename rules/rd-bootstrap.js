function boostrap(user, context, callback) {
  const _ = require('lodash@4.17.10');
  const ManagementClient = require('auth0@2.17.0').ManagementClient;

  // Limit access to the following audience, client credentials exchange only.
  const excludedAudiences = ['https://api-db.letsdoauth.com'];
  const audience = _.get(context, 'request.query.audience', '').toLowerCase();
  if (excludedAudiences.includes(audience)) {
    callback(new UnauthorizedError('Cannot access protected API.'));
    return;
  }

  // prettier-ignore
  global.management = global.management || new ManagementClient({
      domain: auth0.domain,
      token: auth0.accessToken
    });

  // prettier-ignore
  global.isJson = global.isJson || function(headers) {
      const contentType = headers['Content-Type'] || headers['content-type'] || '';
      return contentType.includes('application/json');
    };

  // prettier-ignore
  global.requestPostAsync = global.requestPostAsync || function(options) {
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
    };

  callback(null, user, context);
}
