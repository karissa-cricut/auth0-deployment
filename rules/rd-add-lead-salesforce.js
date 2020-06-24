function addLeadSalesforce(user, context, callback) {
  const CLIENT_ID = '##SALESFORCE_CLIENT_ID##';
  const CLIENT_SECRET = '##SALESFORCE_CLIENT_SECRET##';
  const PASSWORD = '##SALESFORCE_PASSWORD##';
  const USERNAME = '##SALESFORCE_USERNAME##';

  user.app_metadata = user.app_metadata || {};
  user.user_metadata = user.user_metadata || {};

  if (user.app_metadata.recorded_as_lead) {
    callback(null, user, context);
    return;
  }

  getSFToken(CLIENT_ID, CLIENT_SECRET, USERNAME, PASSWORD)
    .then((resp) => {
      return createSFLead(resp.instance_url, resp.access_token, user);
    })
    .then((resp) => {
      user.app_metadata.recorded_as_lead = true;

      auth0.users.updateAppMetadata(user.user_id, user.app_metadata);

      callback(null, user, context);
    })
    .catch((err) => callback(err));

  function createSFLead(sfUrl, sfToken, user) {
    const body = {
      FirstName: user.given_name,
      LastName: user.family_name,
      Email: user.email,
      Company: 'ACME Corp',
      LeadSource: 'Auth0 Sign Up'
    };

    return global.postAsync({
      url: `${sfUrl}/services/data/v43.0/sobjects/Lead`,
      headers: {
        Authorization: `OAuth ${sfToken}`
      },
      body: body,
      json: true
    });
  }

  function getSFToken(clientId, clientSecret, username, password) {
    const form = {
      grant_type: 'password',
      client_id: clientId,
      client_secret: clientSecret,
      username: username,
      password: password
    };

    return global.postAsync({
      url: 'https://login.salesforce.com/services/oauth2/token',
      form: form,
      json: true
    });
  }
}
