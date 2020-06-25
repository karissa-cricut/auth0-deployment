function multiFactorStepUp(user, context, callback) {
  const _ = require('lodash@4.17.10');

  const CLIENTS = ['Auth0 Demo SPA', 'Auth0 Demo Web App'];
  const POLICIES =
    'http://schemas.openid.net/pape/policies/2007/06/multi-factor';

  if (!CLIENTS.includes(context.clientName)) {
    callback(null, user, context);
    return;
  }

  const query = _.get(context, 'request', {});
  if (query.acr_values !== POLICIES) {
    callback(null, user, context);
    return;
  }

  context.multifactor = {
    allowRememberBrowser: false,
    provider: 'any'
  };

  callback(null, user, context);
}
