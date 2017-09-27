import { Template } from 'meteor/templating';

import { Workshops } from '/imports/api/workshops.js';

import './generalDashboard.html';

Template.generalDashboard.helpers({
  getWorkshops() {
    const workshops = Workshops.find().fetch();
    let ids = [];
    workshops.forEach((element) => {
      ids.push(element._id);
    });
    return ids;
  }
});
