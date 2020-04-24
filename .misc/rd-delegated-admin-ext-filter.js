function delegatedAdminExtFilter(ctx, callback) {
  const groups = ctx.request.user.app_metadata.groups || [];

  if (groups.length === 0) {
    callback(new Error('The current user is not part of any group.'));
    return;
  }

  if (groups.includes('Administrator')) {
    callback();
    return;
  }

  const query =
    'app_metadata.groups:(' +
    groups
      .map(function(g) {
        return '+"' + g + '"';
      })
      .join(' ') +
    ')';

  // Return the lucene query.
  callback(null, query);
}
