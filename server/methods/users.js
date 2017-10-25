import { check } from 'meteor/check';
import { UserSchema } from '/imports/api/schemas.js';
import { Notifications } from '/imports/api/notifications.js';

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

  /*** update methods ***/
  'user.updateName'( newName ) {
    check(newName, String);
    if(newName.length == 0) {
      throw new Meteor.Error(403, 'Name may not be empty');
    }
    Meteor.users.update(this.userId, {
      $set: { 'profile.name': newName }
    });
  },
  'user.updatePhone'( newPhone ) {
    check(newPhone, Number);
    Meteor.users.update(this.userId, {
      $set: { 'profile.phone': newPhone }
    });
  },
  'user.updateDesc'( newDesc ) {
    check(newDesc, String);
    Meteor.users.update(this.userId, {
      $set: { 'profile.desc': newDesc }
    });
  },
  'users.pushAttendsTo'( userId, workId ) {
    // push only if it's not already in
    if(Meteor.users.findOne(userId).profile.attendsTo.indexOf(workId) === -1) {
      Meteor.users.update(userId, {
        $push: { 'profile.attendsTo': workId }
      });
    } else {
      throw new Meteor.Error(403, 'User is already participating');
    }
  },

  'users.pullAttendsTo'( userId, workId ) {
    if(Meteor.users.findOne(userId).profile.attendsTo.indexOf(workId) !== -1) {
      Meteor.users.update(this.userId, {
        $pull: { 'profile.attendsTo': workId }
      });
    } else {
      throw new Meteor.Error(403, 'User is not participating');
    }
  },

  'user.selfDelete'() {
    if (!Meteor.isServer) return;

    try {
      Meteor.users.remove(this.userId);
    } catch (e) {
      throw new Meteor.Error('self-delete', e.message);
    }
  },

  'user.pushNotification'( receiverId, notifId ) {
    check(receiverId, String);
    check(notifId, String);
    try {
      Meteor.users.update(receiverId, {
        $push: { 'profile.notifications': notifId }
      });
    } catch (e) {
      throw new Meteor.Error('push-notif', e.message);
    }
  },

  'user.pullNotification'( receiverId, notifId ) {
    check(receiverId, String);
    check(notifId, String);
    try {
      Meteor.users.update(receiverId, {
        $pull: { 'profile.notifications': notifId }
      });
    } catch (e) {
      throw new Meteor.Error('pull-notif', e.message);
    }
  }
})
