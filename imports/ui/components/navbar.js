import { Template } from 'meteor/templating';

import './loginButton.js';
import './signupButton.js';
import './navbar.html';

Template.navbar.events({
  'click .ui.logout.item'() {
    Meteor.logout();
  }
});
