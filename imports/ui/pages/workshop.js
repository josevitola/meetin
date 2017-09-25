import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { toggle } from '/imports/lib/datahelpers.js';
import { Workshops } from '/imports/api/workshops.js';
import './workshop.html';

Template.workshop.onCreated(function workshopOnCreated() {
  ws = Workshops.find(FlowRouter.getParam('_id')).fetch()[0];
  this.ws = new ReactiveVar(ws);
});

Template.workshop.helpers({
  // TODO declare subscriptions when autopublish is deleted
  // FIXME getParam reactivity causes errors when rendering!
  isUserAttending() {
    return Meteor.user().profile.workshops.indexOf(FlowRouter.getParam('_id')) > -1;
  },
  getOwnerId() {
    return Template.instance().ws.get().owner;
  },
  getOwnerName() {
    let wsId = Template.instance().ws.get().owner;
    return Meteor.users.find({_id: wsId}).fetch()[0].profile.name;
  },
  getWorkshopName() {
    return Template.instance().ws.get().name;
  },
  getWorkshopAddr() {
    return Template.instance().ws.get().addr;
  },
  getWorkshopPrice() {
    return Template.instance().ws.get().price;
  },
});

Template.workshop.events({
  'click .ui.join.workshop.button'(event, instance) {
    let workshops = Meteor.user().profile.workshops;
    let workId = instance.ws.get()._id;

    Meteor.call('users.updateWorkshops', toggle(workshops, workId));
  }
});
