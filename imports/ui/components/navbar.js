import { Template } from 'meteor/templating';

import './loginModal.js';
import './signupModal.js';
import './navbar.html';

Template.navbar.events({
  'click .ui.logout.item'() {
    Meteor.logout();
  },

  'click .ui.login.button'() {
    $("#loginModal").modal('show');
  },

  'click .ui.signup.button'() {
    $("#signupModal").modal('show');
  }
});
