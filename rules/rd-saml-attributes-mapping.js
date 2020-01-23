function samlAttributesMapping(user, context, callback) {
  const AUDIENCE = 'https://rudydahbura-dev-ed.my.salesforce.com';
  const CLIENTS = ['eO16DYGJUOCphUCPiJ70jJGySPEv6gpK'];

  if (!CLIENTS.includes(context.clientID)) {
    callback(null, user, context);
    return;
  }

  context.samlConfiguration = context.samlConfiguration || {};

  context.samlConfiguration.audience = AUDIENCE;
  context.samlConfiguration.mapIdentities = false;
  context.samlConfiguration.mapUnknownClaimsAsIs = false;
  context.samlConfiguration.passthroughClaimsWithNoMapping = false;

  context.samlConfiguration.mappings = {
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier':
      'email'
  };

  callback(null, user, context);
}
