import { Mongo } from 'meteor/mongo';

export const Notifications = new Mongo.Collection('notifications');

if(Meteor.isServer) {
  Meteor.publish('notifications', function () {
    return Notifications.find({});
  })
}
