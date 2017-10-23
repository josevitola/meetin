import { Template } from 'meteor/templating';

import { styleShortDate, formatTime } from '/imports/lib/stylish.js';
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
  sort(notifs) {
    if(notifs)
      return notifs.reverse();
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
      return 'Hoy a las ' + formatTime(date);
    }
    return styleShortDate(date);
  }
});
