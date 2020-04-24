function delegatedAdminExtMemberships(ctx, callback) {
  var groups = ctx.payload.user.app_metadata.groups || [];

  if (groups.length === 0) {
    callback(null, []);
    return;
  }

  if (groups.includes('Administrator')) {
    callback(null, ['Administrator', 'Engineering']);
    return;
  }

  callback(null, groups);
}
