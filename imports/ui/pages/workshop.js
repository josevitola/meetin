import { Template } from 'meteor/templating';

import { toggle } from '/imports/lib/datahelpers.js';
import { Workshops } from '/imports/api/workshops.js';
import './workshop.html';

Template.workshop.helpers({
  // TODO declare subscriptions when autopublish is deleted
  // FIXME getParam reactivity causes errors when rendering!
  isUserAttending() {
    return Meteor.user().profile.workshops.indexOf(FlowRouter.getParam('_id')) != -1;
  },
  getWorkshopName() {
    return Workshops.find(FlowRouter.getParam('_id')).fetch()[0].name;
  },
  getWorkshopAddr() {
    return Workshops.find(FlowRouter.getParam('_id')).fetch()[0].addr;
  },
  getWorkshopPrice() {
    return Workshops.find(FlowRouter.getParam('_id')).fetch()[0].price;
  },
});

Template.workshop.events({
  'click .ui.join.workshop.button'() {
    let workshops = Meteor.user().profile.workshops;
    let workId = FlowRouter.getParam('_id');

    Meteor.call('users.updateWorkshops', toggle(workshops, workId));
  }
});
