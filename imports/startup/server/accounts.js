const validateEmail = function(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

Accounts.validateNewUser((user) => {
  new SimpleSchema({
    _id: { type: String },
    emails: { type: Array },
    'emails.$': { type: Object },
    'emails.$.address': { type: String },
    'emails.$.verified': { type: Boolean },
    services: { type: Object, blackbox: true },
    createdAt: { type: Date },
    profile: { type: Object },
    'profile.name': { type: String }
  }).validate(user);

  return true;
});

Meteor.methods({
  'users.insert'( user ) {
    if (!user.password || user.password.length < 4) {
      throw new Meteor.Error(403, 'Password must be longer than 3 ');
    }
    if (!validateEmail(user.email)) {
      throw new Meteor.Error(403, 'Username must have at least 3 characters');
    }
    if (!user.profile.name) {
      throw new Meteor.Error(403, 'Name may not be empty')
    }

    Accounts.createUser( user );
  }
})
