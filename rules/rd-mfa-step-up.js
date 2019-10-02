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

  const { query = {} } = context.request;
  if (query.acr_values !== MFA_POLICIES) {
    callback(null, user, context);
    return;
  }

  context.multifactor = {
    allowRememberBrowser: false,
    provider: 'any'
  };

  callback(null, user, context);
}
