import { check } from 'meteor/check';
import { Random } from 'meteor/random';
import { Promise } from 'meteor/promise';
import { Workshops } from '/imports/api/workshops.js';

import { validateEmail } from '/imports/lib/stylish.js';
import { UserSchema } from '/imports/api/schemas.js';
import { Notifications } from '/imports/api/notifications.js';
import { fileUpload } from '/imports/api/server/dropbox.js'

//
// ─── PUBLISHING ─────────────────────────────────────────────────────────────────
//


Meteor.publish('users', function() {
  return Meteor.users.find();
});

Meteor.publish('user', function(id) {
  return Meteor.users.find(id);
});

Meteor.publish('userGroup', function(ids) {
  return Meteor.users.find({_id: {$in: ids}});
});

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
  
//
// ─── METHODS ────────────────────────────────────────────────────────────────────
//

  
Meteor.methods({
  'users.insert'( name, mail, pass ) {
    if (!pass || pass.length < 4) {
      throw new Meteor.Error(403, 'Password must be longer than 3 ');
    }

    if (!validateEmail(mail)) {
      throw new Meteor.Error(403, 'Email is not validated');
    }
    if (!name) {
      throw new Meteor.Error(403, 'Name may not be empty')
    }

    const phone = 0;
    const desc = "";
    const attendsTo = [];
    const owns = [];
    const notifications = [];

    const user = {
      email: mail,
      password: pass,
      profile: {
        name: name,
        phone: phone,
        desc: desc,
        attendsTo: attendsTo,
        owns: owns,
        notifications: notifications
      }
    }

    Accounts.createUser( user );
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
  'user.updatePhoto'( file, type ) {
    let profile = Meteor.users.findOne(this.userId).profile;
    let path = "/images/users";

    if(profile.photo && profile.photo.indexOf('www.dropbox.com/') > 0){
      path += slice(a.lastIndexOf('/'),a.lastIndexOf('?'));
    }else{
      path += '/' + Random.id() + '.' + type.split('/').pop();
    }

    var urlImage = Promise.await(fileUpload(path, Buffer.from(file, 'binary')));
    console.log(urlImage);

    Meteor.users.update(this.userId, {
      $set: { 'profile.photo': urlImage.url.replace('dl=0','raw=1') }
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
