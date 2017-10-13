import { Template } from 'meteor/templating';

import { Workshops } from '/imports/api/workshops.js';

import './generalDashboard.html';

Template.generalDashboard.helpers({
  getWorkshops() {
    return Workshops.find().fetch();
  }
});
