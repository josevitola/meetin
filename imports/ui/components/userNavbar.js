import { Template } from 'meteor/templating';

import './userNavbar.html';

Template.userNavbar.onRendered(function userNavbarOnRendered() {
  $('.ui.options.dropdown').dropdown();
});

Template.userNavbar.helpers({
  getUserName() {
    if(Meteor.user()) {
      return Meteor.user().profile.name;
    }
    else return "";
  },
  getUserEmail() {
    if(Meteor.user()) {
      return Meteor.user().email;
    }
    else return "";
  }
});

Template.userNavbar.events({
  'click .logout.item'() {
    Meteor.logout(() => {
      FlowRouter.go('/');
    });
  }
});
