import { Template } from 'meteor/templating';

import '../components/searchBar.js';
import '../components/workshopCard.js';

import '../layouts/generalDashboard.js';
import '../layouts/userDashboard.js';

import './home.html';

Template.home.onRendered(function() {
  document.title = 'Meetin';
})

Template.home.helpers({
  profile() {
    return Meteor.user() || Meteor.loggingIn() ? "user" : "guest";
  }
});

Template.home.events({
  'click .ui.signup.button'() {
    if(Meteor.user() && Meteor.loggingIn()) {
      FlowRouter.go('/workshops/create');
    } else {
      Session.set('accountsModal', 'signup');
      $("#accountsModal").modal('show');      
    }
  }
})
