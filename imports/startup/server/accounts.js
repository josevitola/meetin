import { check } from 'meteor/check';
import { UserSchema } from '/imports/api/schemas.js';
import { Workshops } from '/imports/api/workshops.js';

const validateEmail = function(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

/**** VALIDATION ****/
Accounts.validateNewUser((user) => {
  UserSchema.validate(user);

  return true;
});

/**** HOOKS ****/
Meteor.users.after.remove((id, user) => {
  let workshops = Workshops.remove({owner: user._id});
});

/**** METHODS ****/
Meteor.methods({
  'users.insert'( userDraft ) {
    if (!userDraft.password || userDraft.password.length < 4) {
      throw new Meteor.Error(403, 'Password must be longer than 3 ');
    }

    if (!validateEmail(userDraft.email)) {
      throw new Meteor.Error(403, 'Email is not validated');
    }
    if (!userDraft.profile.name) {
      throw new Meteor.Error(403, 'Name may not be empty')
    }

    Accounts.createUser( userDraft );
  },

  'users.updateAttendsTo'( userId, workshops ) {
    check(workshops, [String]);
    Meteor.users.update(userId, {
      $set: { 'profile.attendsTo': workshops }
    });
  },

  'user.updateOwnAttendsTo'( workshops ) {
    check(workshops, [String]);
    Meteor.users.update(this.userId, {
      $set: { 'profile.attendsTo': workshops }
    });
  },

  'user.selfDelete'() {
    if (!Meteor.isServer) return;

    try {
      Meteor.users.remove(this.userId);
    } catch (e) {
      throw new Meteor.Error('self-delete', 'Failed to remove yourself');
    }
  },
})

// TODO actually do this thing
Meteor.publish('users', function() {
  return Meteor.users.find();
});
