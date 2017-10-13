import { Template } from 'meteor/templating';

import { Workshops } from '/imports/api/workshops.js';

import './generalDashboard.js';
import './userDashboard.html';

Template.userDashboard.helpers({
  workshopsToday() {
    var start = new Date();
    start.setHours(0,0,0,0);

    var end = new Date();
    end.setHours(23,59,59,999);
    return Workshops.find({createdAt: {$gte: start, $lt: end}}).fetch();
  },

  getAttendsTo() {
    return Workshops.find({
      _id: {
        $in : Meteor.user().profile.attendsTo
      }
    }).fetch();
  }
});
