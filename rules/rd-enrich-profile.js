function enrichProfile(user, context, callback) {
  const FULLCONTACT_KEY = configuration.FULLCONTACT_KEY;
  const SLACK_WEBHOOK_URL = configuration.SLACK_WEBHOOK_URL;
  const SLACK_CHANNEL = '#demo';

  const slack = require('slack-notify@0.1.4')(SLACK_WEBHOOK_URL);

  user.user_metadata = user.user_metadata || {};

  if (!user.email || user.user_metadata.fullcontact) {
    callback(null, user, context);
    return;
  }

  getProfile().then(
    resp => {
      user.user_metadata.fullcontact = resp;

      auth0.users.updateUserMetadata(user.user_id, user.user_metadata);

      callback(null, user, context);
    },
    err => {
      slack.alert({
        channel: SLACK_CHANNEL,
        text: 'Fullcontact API error.',
        fields: {
          description: err.message
        }
      });

      callback(err);
    }
  );

  function getProfile() {
    const body = {
      email: user.email
    };

    return global.requestPostAsync({
      url: 'https://api.fullcontact.com/v3/person.enrich',
      headers: {
        Authorization: 'Bearer ' + FULLCONTACT_KEY
      },
      body: body,
      json: true
    });
  }
}
