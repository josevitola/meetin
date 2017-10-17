import { Template } from 'meteor/templating';

import { Notifications } from '/imports/api/notifications.js';
import './searchBar.js';
import './userNavbar.html';

Template.userNavbar.onCreated(function userNavbarOnCreated() {
  this.subscribe('notifications');
})

Template.userNavbar.onRendered(function userNavbarOnRendered() {
  $('.ui.options.dropdown').dropdown();
});

Template.userNavbar.helpers({
  getUserEmail() {
    if(Meteor.user()) {
      return Meteor.user().emails[0].address;
    }
    else return "";
  },
  unreadNotifs(notifIds) {
    return Notifications.find({_id: {$in: notifIds}, read: false}).count() === 0;
  },
  getNotifNumber(notifIds) {
    return Notifications.find({_id: {$in: notifIds}, read: false}).count();
  }
});

Template.userNavbar.events({
  'click .create.workshop'() {
    FlowRouter.go('/workshops/create');
  },
  'click .notif.icon'() {
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
