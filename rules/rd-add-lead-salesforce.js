async function addLeadSalesforce(user, context, callback) {
  const CLIENT_ID = '##SALESFORCE_CLIENT_ID##';
  const CLIENT_SECRET = '##SALESFORCE_CLIENT_SECRET##';
  const PASSWORD = '##SALESFORCE_PASSWORD##';
  const USERNAME = '##SALESFORCE_USERNAME##';

  user.app_metadata = user.app_metadata || {};
  if (user.app_metadata.recorded_as_lead) {
    callback(null, user, context);
    return;
  }

  try {
    const token = await getSFToken(
      CLIENT_ID,
      CLIENT_SECRET,
      USERNAME,
      PASSWORD
    );

    const res = await createSFLead(
      token.instance_url,
      token.access_token,
      user
    );

    user.app_metadata.recorded_as_lead = true;
    auth0.users.updateAppMetadata(user.user_id, user.app_metadata);

    callback(null, user, context);
  } catch (err) {
    callback(err);
  }

  async function createSFLead(instanceUrl, token, user) {
    const url = new URL(`${instanceUrl}/services/data/v43.0/sobjects/Lead`);

    const body = JSON.stringify({
      FirstName: user.given_name,
      LastName: user.family_name,
      Email: user.email,
      Company: 'ACME Corp',
      LeadSource: 'Auth0 Sign Up'
    });

    const resp = await global.postAsync(url, {
      headers: {
        Authorization: `OAuth ${token}`,
        'Content-Type': 'application/json'
      },
      body: body
    });

    return resp;
  }

  async function getSFToken(clientId, clientSecret, username, password) {
    const url = new URL('https://login.salesforce.com/services/oauth2/token');

    const body = new URLSearchParams();
    body.append('grant_type', 'password');
    body.append('client_id', clientId);
    body.append('client_secret', clientSecret);
    body.append('username', username);
    body.append('password', password);

    const resp = await global.postAsync(url, {
      body: body
    });

    return resp;
  }
}
