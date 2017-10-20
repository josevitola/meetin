import { Template } from 'meteor/templating';

import './searchBar.js';
import './userNavbar.html';

Template.userNavbar.onRendered(function userNavbarOnRendered() {
  $('.ui.options.dropdown').dropdown();
});

Template.userNavbar.helpers({
  getUserEmail() {
    if(Meteor.user()) {
      return Meteor.user().emails[0].address;
    }
    else return "";
  }
});

Template.userNavbar.events({
  'click .create.workshop'() {
    FlowRouter.go('/workshops/create');
  },
  'click .logout.item'() {
    Meteor.logout(() => {
      FlowRouter.go('/');
    });
  }
});
