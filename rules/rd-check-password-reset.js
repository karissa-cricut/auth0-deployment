function checkPasswordReset(user, context, callback) {
  function daydiff(first, second) {
    return (second - first) / (1000 * 60 * 60 * 24);
  }

  var last_password_change = user.last_password_reset || user.created_at;

  if (daydiff(new Date(last_password_change), new Date()) > 30) {
    callback(new UnauthorizedError('Please change your password.'));
    return;
  }

  callback(null, user, context);
}
