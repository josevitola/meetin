import { Template } from 'meteor/templating';

import { isToday } from '/imports/lib/clock.js';
import { styleShortDate } from '/imports/lib/stylish.js';

import { Images } from '/imports/api/files.js';
import { Notifications } from '/imports/api/notifications.js';
import { Workshops } from '/imports/api/workshops.js';

import './searchBar.js';
import './userNavbar.html';

Template.userNavbar.onCreated(function userNavbarOnCreated() {
  this.subscribe('notifications');
  this.subscribe('workshops');
})

Template.userNavbar.onRendered(function userNavbarOnRendered() {
  // $('.notif.item').popup({
  //   popup: '.popup',
  //   on: 'click'
  // });
  $('.ui.options.dropdown').dropdown();
});

Template.userNavbar.helpers({
  unread(notifIds) {
    return Notifications.find({_id: {$in: notifIds}, read: false}).count() != 0;
  },
  countUnreadNotifs(notifIds) {
    return Notifications.find({_id: {$in: notifIds}, read: false}).count();
  },
  getNotifs(notifIds) {
    return Notifications.find({_id: {$in: notifIds}}, {limit: 6, sort: {createdAt: -1}}).fetch();
  },
  picSrc(picId) {
    if(picId) {
      const image = Images.findOne(picId);
      return image ? image.link() : '/default.jpg';
    }
    return 'https://robohash.org/' + Meteor.user().emails[0].address + '.png?size=50x50';
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

Template.userNavbar.events({
  'click .create.workshop'() {
    FlowRouter.go('/workshops/create');
  },
  'click .notif.item'() {
    if(Meteor.user()) {
      Meteor.call('notifications.read', Meteor.user().profile.notifications);
    }
  },
  'click .logout.item'() {
    Meteor.logout(() => {
      FlowRouter.go('/');
    });
  }
});
