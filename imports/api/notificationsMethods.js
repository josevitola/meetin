import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Notifications } from './notifications.js';
import { NotificationSchema } from './schemas.js';

Notifications.after.insert((userId, notification) => {
  console.log('notif insert successful');
  Meteor.call('user.pushNotification', notification);
});

Meteor.methods({
  'notifications.insert'( notification ) {
    NotificationSchema.validate( notification );
    return Notifications.insert(notification);
  }
})
