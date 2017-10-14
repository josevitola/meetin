let settings = Meteor.settings.private.mandrill;

Mandrill.config({
  username: settings.user,
  key: settings.apiKey
});
