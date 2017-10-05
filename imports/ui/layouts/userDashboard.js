import { Template } from 'meteor/templating';

import { Workshops } from '/imports/api/workshops.js';

import './generalDashboard.js';
import './userDashboard.html';

// TODO if event has been eliminated, delete reference from user profile

Template.userDashboard.onCreated(function userDashboardOnCreated() {
  this.user = new ReactiveVar(Meteor.user());
})

Template.userDashboard.helpers({
  getWorkshopsToAttend() {
    return Template.instance().user.get().profile.attendsTo;
  }
});
