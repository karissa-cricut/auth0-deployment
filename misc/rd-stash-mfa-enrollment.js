async function stashMfaEnrollment(user, context, callback) {
  const ManagementClient = require('auth0@2.17.0').ManagementClient;
  const CLIENTS = ['avihIORs8QUms1CXk3HkdTWS16ZOQGDP'];
  const NS = 'https://letsdoauth.com';

  if (!CLIENTS.includes(context.clientID)) {
    callback(null, user, context);
    return;
  }

  const phoneNumber = user.app_metadata.phone_number;

  const management = new ManagementClient({
    token: auth0.accessToken,
    domain: auth0.domain
  });

  const enrollments = await management.getGuardianEnrollments({
    id: user.user_id
  });

  const hasMfaEnrollment = !!enrollments.find(e =>
    e.phone_number.slice(-4) === phoneNumber.slice(-4) &&
    e.status === 'confirmed' &&
    e.type === 'sms'
  );

  context.idToken[`${NS}/has_mfa_enrollment`] = hasMfaEnrollment;

  if (hasMfaEnrollment || (!hasMfaEnrollment && context.protocol === 'oauth2-refresh-token')) {
    context.multifactor = {
      provider: 'any',
      allowRememberBrowser: false
    };
  }

  callback(null, user, context);
}
