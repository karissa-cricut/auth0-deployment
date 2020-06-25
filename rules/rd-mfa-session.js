function multiFactorSession(user, context, callback) {
  const _ = require('lodash@4.17.10');

  const CLIENTS = ['Auth0 Demo SPA', 'Auth0 Demo Web App'];

  // check if MFA enabled for client
  if (!CLIENTS.includes(context.clientName)) {
    callback(null, user, context);
    return;
  }

  // check if MFA has been completed
  const methods = _.get(context, 'authentication.methods', []);
  const completedMfa = !!methods.find((method) => method.name === 'mfa');

  if (completedMfa) {
    callback(null, user, context);
    return;
  }

  context.multifactor = {
    provider: 'any',
    allowRememberBrowser: false
  };

  callback(null, user, context);
}
