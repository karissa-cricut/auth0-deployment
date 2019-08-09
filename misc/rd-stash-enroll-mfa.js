async function stashEnrollMda(user, context, callback) {
  const NS = 'https://letsdoauth.com';
  const phoneNumber = user.app_metadata.phone_number;

  context.idToken[`${NS}/phone_number`] = phoneNumber;

  const ManagementClient = require('auth0@2.17.0').ManagementClient;
  const management = new ManagementClient({
    token: auth0.accessToken,
    domain: auth0.domain
  });

  const enrollments = await management.getGuardianEnrollments({
    id: user.user_id
  });

  const isMfaEnrolled = !!enrollments.find(e =>
    e.type === 'sms' &&
    e.status === 'confirmed' &&
    e.phone_number.slice(-4) === phoneNumber.slice(-4)
  );

  if ((!isMfaEnrolled && context.protocol === 'oauth2-refresh-token') || isMfaEnrolled) {
    context.multifactor = {
      provider: 'any',
      allowRememberBrowser: false
    };
  }

  callback(null, user, context);
}
