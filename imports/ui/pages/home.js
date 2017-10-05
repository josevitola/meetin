import { Template } from 'meteor/templating';

import '../components/workshopCard.js';

import '../layouts/generalDashboard.js';
import '../layouts/userDashboard.js';

import './home.html';

Template.home.helpers({
  profile() {
    return Meteor.user() || Meteor.loggingIn() ? "user" : "guest";
  }
});

Template.home.events({
  'click .ui.signup.button'() {
    $("#signupModal").modal('show');
  }
})
