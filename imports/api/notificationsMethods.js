import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Notifications } from './notifications.js';
import { NotificationSchema } from './schemas.js';

Notifications.after.insert((userId, notification) => {
  console.log('notif insert successful');
  Meteor.call('user.pushNotification', notification.receiver, notification._id);
});

Meteor.methods({
  'notifications.insert'( sender, receiver, type, event ) {
    console.log(sender);
    const notification = {
      sender: sender,
      receiver: receiver,
      type: type,
      event: event,
      createdAt: new Date(),
      read: false
    }
    NotificationSchema.validate( notification );
    return Notifications.insert(notification);
  }
})
