import { Template } from 'meteor/templating';

import { Workshops } from '/imports/api/workshops.js';

import './generalDashboard.html';

Template.generalDashboard.onCreated(function generalDashboardOnCreated() {
  this.subscribe('workshops');
})

Template.generalDashboard.helpers({
  getWorkshops() {
    return Workshops.find().fetch();
  }
});
