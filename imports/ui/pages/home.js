import { Template } from 'meteor/templating';

import { Workshops } from '/imports/api/workshops.js';

import '../components/workCreateModal.js';
import '../components/workshopCard.js';
import './home.html';

Template.home.helpers({
  getWorkshops() {
    const workshops = Workshops.find().fetch();
    let ids = [];
    workshops.forEach((element) => {
      ids.push(element._id);
    });
    return ids;
  }
});
