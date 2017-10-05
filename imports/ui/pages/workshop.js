import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { toggle } from '/imports/lib/datahelpers.js';
import { Workshops } from '/imports/api/workshops.js';
import './workshop.html';

Template.workshop.onCreated(function workshopOnCreated() {
  Tracker.autorun(() => {
    ws = Workshops.find(FlowRouter.getParam('_id')).fetch()[0];
    this.ws = new ReactiveVar(ws);
  });
  this.isEditing = new ReactiveVar(false);
});

Template.workshop.helpers({
  // TODO declare subscriptions when autopublish is deleted
  isUserAttending() {
    return Meteor.user().profile.attendsTo.indexOf(FlowRouter.getParam('_id')) > -1;
  },
  getOwnerName(ownerId) {
    return Meteor.users.findOne(ownerId).profile.name;
  },
  workshop() {
    return Workshops.findOne(FlowRouter.getParam('_id'));
  },
  lengthOf(array) {
    return array.length;
  },
  participantsSliced(participants) {
    if(participants.length >= 7) {
      return participants.slice(7, participants.length);
    } else {
      return participants;
    }
  },
  isUserOwner(ownerId) {
    return Meteor.userId() === ownerId;
  },
  isEditing() {
    return Template.instance().isEditing.get();
  }
});

Template.workshop.events({
  'click .ui.join.workshop.button'(event, instance) {
    let workshops = Meteor.user().profile.attendsTo;
    let ws = instance.ws.get();
    const workId = ws._id;
    const participants = instance.ws.get().participants;

    Meteor.call('users.updateWorkshops', toggle(workshops, workId));
    Meteor.call('workshops.setUserAsParticipant', workId);
  },

  'click .ui.edit.button'(event, instance) {
    instance.isEditing.set(true);
  }
});
