import { check } from 'meteor/check';
import { UserSchema } from '/imports/api/schemas.js';
import { Notifications } from '/imports/api/notifications.js';
import { Workshops } from '/imports/api/workshops.js';

const validateEmail = function(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

//
// ─── VALIDATION ─────────────────────────────────────────────────────────────────
//

  
Accounts.onCreateUser(function(options, user) { 
  if (user.services.facebook) {
    user.emails = [{address: user.services.facebook.email}];
    user.profile = {};
    user.profile.name = user.services.facebook.name;
    // TODO profile pic!
    user.profile.attendsTo  = [];
    user.profile.owns       = [];
    user.profile.phone      = 0;
    user.profile.desc       = '';
    user.profile.notifications = [];
  }  

  if(options.profile) {
    user.profile = options.profile;
  }

  UserSchema.validate(user);
  return user;
});

//
// ─── HOOKS ──────────────────────────────────────────────────────────────────────
//

  
Meteor.users.before.remove((id, user) => {
  const userId = user._id;
  // remove owned workshops
  Workshops.remove({owner: userId});

  // remove participation from workshops
  const participating = Workshops.find({participants: userId});
  participating.forEach((workshop) => {
    Meteor.call('workshops.pullParticipant', workshop._id );
  });

  // remove sent notifications
  const notifications = Notifications.remove({sender: userId});
});

// TODO actually do this thing
if(Meteor.isServer) {
  Meteor.publish('users', function() {
    return Meteor.users.find();
  });
}
  