function addLeadSalesforce(user, context, callback) {
  const SF_CLIENT_ID = '##SALESFORCE_CLIENT_ID##';
  const SF_CLIENT_SECRET = '##SALESFORCE_CLIENT_SECRET##';
  const SF_PASSWORD = '##SALESFORCE_PASSWORD##';
  const SF_USERNAME = '##SALESFORCE_USERNAME##';
  const SLACK_CHANNEL = '#demo';
  const SLACK_WEBHOOK_URL = '##SLACK_WEBHOOK_URL##';

  const slack = require('slack-notify@0.1.4')(SLACK_WEBHOOK_URL);

  user.user_metadata = user.user_metadata || {};
  user.app_metadata = user.app_metadata || {};

  if (user.app_metadata.recorded_as_lead) {
    callback(null, user, context);
    return;
  }

  getSalesforceToken(SF_CLIENT_ID, SF_CLIENT_SECRET, SF_USERNAME, SF_PASSWORD)
    .then(
      (resp) => {
        const salesforceUrl = resp.instance_url;
        const salesforceToken = resp.access_token;

        return createSalesforceLead(salesforceUrl, salesforceToken, user);
      },
      (err) => {
        slack.alert({
          channel: SLACK_CHANNEL,
          text: 'Error getting Salesforce access token.',
          fields: {
            description: err.message
          }
        });

        callback(err);
      }
    )
    .then(
      (resp) => {
        slack.alert({
          channel: SLACK_CHANNEL,
          text: `Succesfully created Salesforce lead: ${user.email}.`
        });

        user.app_metadata.recorded_as_lead = true;

        auth0.users.updateAppMetadata(user.user_id, user.app_metadata);

        callback(null, user, context);
      },
      (err) => {
        slack.alert({
          channel: SLACK_CHANNEL,
          text: 'Error creating Salesforce lead.',
          fields: {
            description: err.message
          }
        });

        callback(err);
      }
    );

  function createSalesforceLead(salesforceUrl, salesforceToken, user) {
    const fullcontact = user.user_metadata.fullcontact;
    const body = {
      City: '',
      Company: 'ACME Corp',
      Country: 'USA',
      Email: user.email,
      FirstName: user.given_name,
      LastName: user.family_name,
      LeadSource: 'Auth0 Sign Up',
      State: 'CA'
    };

    return global.postAsync({
      url: `${salesforceUrl}/services/data/v43.0/sobjects/Lead`,
      headers: {
        Authorization: `OAuth ${salesforceToken}`
      },
      body: body,
      json: true
    });
  }

  function getSalesforceToken(clientId, clientSecret, username, password) {
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
