import { Template } from 'meteor/templating';

import { Workshops } from '/imports/api/workshops.js';

import './generalDashboard.js';
import './userDashboard.html';

Template.userDashboard.onCreated(function userDashboardOnCreated() {
  this.user = new ReactiveVar(Meteor.user());
})

Template.userDashboard.helpers({
  getWorkshopsToAttend() {
    return Template.instance().user.get().profile.workshops;
  }
});
