async function stashMfaEnrollment(user, context, callback) {
  const ManagementClient = require('auth0@2.17.0').ManagementClient;
  const CLIENTS = ['avihIORs8QUms1CXk3HkdTWS16ZOQGDP'];
  const NS = 'https://letsdoauth.com';

  if (!CLIENTS.includes(context.clientID)) {
    callback(null, user, context);
    return;
  }

  const management = new ManagementClient({
    token: auth0.accessToken,
    domain: auth0.domain
  });

  const { phone_number } = user.app_metadata;

  const enrollments = await management.getGuardianEnrollments({
    id: user.user_id
  });

  const hasMfaEnrollment = !!enrollments.find(e =>
    e.phone_number.slice(-4) === phone_number.slice(-4) &&
    e.status === 'confirmed' &&
    e.type === 'sms'
  );

  if (hasMfaEnrollment && context.protocol !== 'oauth2-refresh-token') {
    context.multifactor = {
      provider: 'any',
      allowRememberBrowser: false
    };
  }

  if (!hasMfaEnrollment && context.protocol === 'oauth2-refresh-token') {
    context.multifactor = {
      provider: 'any',
      allowRememberBrowser: false
    };
  }

  callback(null, user, context);
}
