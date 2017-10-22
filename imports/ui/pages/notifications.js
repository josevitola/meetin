import { Template } from 'meteor/templating';

import { styleShortDate } from '/imports/lib/stylish.js';
import { isToday } from '/imports/lib/clock.js';

import { Workshops } from '/imports/api/workshops.js';
import { Notifications } from '/imports/api/notifications.js';
import './notifications.html';


Template.notifications.onRendered(function notificationsOnRendered() {
  document.title = 'Tus notificaciones | Meetin';
})

Template.notifications.onCreated(function notificationsOnCreated() {
  this.subscribe('users');
  this.subscribe('workshops');
  this.subscribe('notifications');
})

Template.notifications.helpers({
  unread(notifIds) {
    return Notifications.find({_id: {$in: notifIds}, read: false}).count() != 0;
  },
  countUnreadNotifs(notifIds) {
    return Notifications.find({_id: {$in: notifIds}, read: false}).count();
  },
  getNotifs(notifIds) {
    console.log(notifIds);
    return Notifications.find({_id: {$in: notifIds}}, {limit: 6, sort: {createdAt: -1}}).fetch();
  },
  notification(notifId) {
    return Notifications.findOne(notifId);
  },
  getSenderName(senderId) {
    const sender = Meteor.users.findOne(senderId);
    if(sender) {
      return sender.profile.name;
    }
  },
  getWorkshopName(workId) {
    const workshop = Workshops.findOne(workId);
    if(workshop) {
      return workshop.name;
    }
  },
  getStyledDate(date) {
    if(isToday(date)) {
      return 'Hoy';
    }
    return styleShortDate(date);
  }
});
