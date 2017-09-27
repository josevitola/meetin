import { Template } from 'meteor/templating';

import './userNavbarItems.html';

Template.userNavbar.onRendered(function userNavbarOnRendered() {
  $('.ui.options.dropdown').dropdown();
});

Template.userNavbar.helpers({
  getUserName() {
    if(Meteor.user()) {
      return Meteor.user().profile.name;
    }
    else return "";
  }
});

Template.userNavbar.events({
  'click .logout.item'() {
    Meteor.logout();
  }
});
