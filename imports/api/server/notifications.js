import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Notifications } from '/imports/api/notifications.js';
import { NotificationSchema } from '/imports/api/schemas.js';

Notifications.after.insert((userId, notification) => {
  Meteor.call('user.pushNotification', notification.receiver, notification._id);
});

Notifications.before.remove((userId, notification) => {
  Meteor.call('user.pullNotification', notification.receiver, notification._id);
});

Meteor.methods({
  'notifications.insert'( sender, receiver, type, event ) {
    const notification = {
      sender: sender,
      receiver: receiver,
      type: type,
      event: event,
      createdAt: Date.parse(new Date()),
      read: false
    }
    NotificationSchema.validate( notification );
    return Notifications.insert(notification);
  },

  'notifications.read'( notifIds ) {
    check(notifIds, [String]);

    try {
      notifIds.forEach((notif) => {
        Notifications.update(notif, {
          $set: { read : true }
        });
      });
    } catch (error) {
      throw new Meteor.Error('notif-read', 'Error at reading notifications');
    }
  }
})
