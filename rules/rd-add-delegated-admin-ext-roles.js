function addDelegatedAdminExtRoles(user, context, callback) {
  const _ = require('lodash@4.17.10');
  const CLIENT = 'Auth0 Delegated Admin';
  const ROLE_ADMIN = 'Delegated Admin - Administrator';
  const ROLE_USER = 'Delegated Admin - User';

  if (context.clientName !== CLIENT) {
    callback(null, user, context);
    return;
  }

  const metadata_roles = _.get(user, 'app_metadata.roles', []);

  if (
    metadata_roles.includes(ROLE_ADMIN) ||
    metadata_roles.includes(ROLE_USER)
  ) {
    callback(null, user, context);
    return;
  }

  const authorization_roles = _.get(context, 'authorization.roles', []);

  if (authorization_roles.includes('Administrator')) {
    metadata_roles.push(ROLE_ADMIN);
  } else {
    metadata_roles.push(ROLE_USER);
  }

  _.set(user, 'app_metadata.roles', metadata_roles);

  auth0.users
    .updateAppMetadata(user.user_id, user.app_metadata)
    .then(() => callback(null, user, context))
    .catch((err) => callback(err));
}
