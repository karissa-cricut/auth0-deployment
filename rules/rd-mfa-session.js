function multiFactorSession(user, context, callback) {
  const MFA_CLIENTS = [
    'lsHbUXlIE1d8SLWgOZBCfBL8SbmRCRc-',
    'pjpZ6NSU6rOTMpdhEJmKzCRUqvKeVVrP'
  ];

  if (!MFA_CLIENTS.includes(context.clientID)) {
    callback(null, user, context);
    return;
  }

  const {
    authentication: {
      methods: methods = []
    }
  } = context;

  const completedMfa = !!context.authentication.methods.find(
    (method) => method.name === 'mfa'
  );

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
