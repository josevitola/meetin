import { Template } from 'meteor/templating';

import { Workshops } from '/imports/api/workshops.js';

import './search.html';

Template.search.onCreated(function searchOnCreated() {
  this.subscribe('workshops');
});

Template.search.onRendered(function searchOnRendered() {
  const key = FlowRouter.getQueryParam('q');
  document.title = 'Búsqueda de ' + key + ' | Meetin';
});

Template.search.helpers({
  query() {
    return FlowRouter.getQueryParam('q');
  },

  workshopsByName() {
    const key = FlowRouter.getQueryParam('q');
    const pattern = '.*' + key + '.*';
    return Workshops.find({name: {$regex: pattern}}).fetch();
  },

  workshopsByTags() {
    const key = FlowRouter.getQueryParam('q');
    const workshops = Workshops.find({tags: key}).fetch();
    return workshops;
  }
});
