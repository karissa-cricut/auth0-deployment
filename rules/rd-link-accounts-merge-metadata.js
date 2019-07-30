function linkAccountsMergeMetadata(user, context, callback) {
  const request = require('request@2.81.0');

  if (!user.email || !user.email_verified) {
    callback(null, user, context);
    return;
  }

  const userSearchApiUrl = auth0.baseUrl + '/users-by-email';

  request(
    {
      url: userSearchApiUrl,
      headers: {
        Authorization: 'Bearer ' + auth0.accessToken
      },
      qs: {
        email: user.email
      }
    },
    (err, response, body) => {
      if (err) {
        callback(err);
        return;
      }

      if (response.statusCode !== 200) {
        callback(new Error(body));
        return;
      }

      let data = JSON.parse(body);
      data = data.filter(function(u) {
        return u.email_verified && u.user_id !== user.user_id;
      });

      if (data.length > 1) {
        callback(
          new Error(
            'Multiple user profiles exist - cannot select base profile to link with.'
          )
        );
        return;
      }

      if (data.length === 0) {
        callback(null, user, context);
        return;
      }

      const originalUser = data[0];

      user.app_metadata = user.app_metadata || {};
      user.user_metadata = user.user_metadata || {};

      auth0.users
        .updateAppMetadata(originalUser.user_id, user.app_metadata)
        .then(() =>
          auth0.users.updateUserMetadata(
            originalUser.user_id,
            user.user_metadata
          )
        )
        .then(() => {
          const provider = user.identities[0].provider;
          const providerUserId = user.identities[0].user_id;
          const userApiUrl = auth0.baseUrl + '/users';

          request.post(
            {
              url: userApiUrl + '/' + originalUser.user_id + '/identities',
              headers: {
                Authorization: 'Bearer ' + auth0.accessToken
              },
              json: {
                provider: provider,
                user_id: providerUserId
              }
            },
            (err, response, body) => {
              if (response && response.statusCode >= 400) {
                callback(
                  new Error('Error linking account: ' + response.statusMessage)
                );
                return;
              }
              context.primaryUser = originalUser.user_id;
              callback(null, user, context);
            }
          );
        })
        .catch(function(err) {
          callback(err);
        });
    }
  );
}
