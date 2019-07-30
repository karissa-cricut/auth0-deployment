function multiFactorStepUp(user, context, callback) {
  const MFA_CLIENTS = [
    'lsHbUXlIE1d8SLWgOZBCfBL8SbmRCRc-',
    'pjpZ6NSU6rOTMpdhEJmKzCRUqvKeVVrP'
  ];
  const MFA_POLICIES =
    'http://schemas.openid.net/pape/policies/2007/06/multi-factor';

  if (!MFA_CLIENTS.includes(context.clientID)) {
    callback(null, user, context);
    return;
  }

  const query = context.request.query || {};
  if (query.acr_values !== MFA_POLICIES) {
    callback(null, user, context);
    return;
  }

  context.multifactor = {
    allowRememberBrowser: false,
    provider: 'any'
  };

  // for the following, review https://tools.ietf.org/html/rfc6749#section-6
  // could be used for endpoints via POST using scope, e.g. /outh/token
  // const scope = (context.request.body.scope || '').split(' ');
  // if (context.protocol !== 'oauth2-refresh-token' || scope.includes('mfa')) {
  //   context.multifactor = {
  //     allowRememberBrowser: false,
  //     provider: 'any'
  //   };
  // }

  callback(null, user, context);
}
