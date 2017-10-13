import { Template } from 'meteor/templating';

import { Workshops } from '/imports/api/workshops.js';

import './search.html';

Template.search.helpers({
  query() {
    return FlowRouter.getQueryParam('q');
  },

  workshopsByName() {
    const key = FlowRouter.getQueryParam('q');
    const pattern = '.*' + key + '.*';
    const workshops = Workshops.find({name: {$regex: pattern}}).fetch();
    console.log(workshops);
    return workshops;
  }
});
