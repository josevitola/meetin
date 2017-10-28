import { Mongo } from 'meteor/mongo';
import { NotificationSchema } from './schemas.js';

var Notification = new Mongo.Collection('notifications');
Notification.attachSchema(NotificationSchema);

export const Notifications = Notification;
