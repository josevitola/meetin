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

  this.isEditingName = new ReactiveVar(false);
  this.isEditingDesc = new ReactiveVar(false);
  this.isEditingList = new ReactiveVar(false);
  this.isEditingAddr = new ReactiveVar(false);
  this.isEditingPrice = new ReactiveVar(false);
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
  isEditingName() {
    return Template.instance().isEditingName.get();
  },
  isEditingDesc() {
    return Template.instance().isEditingDesc.get();
  }
});

Template.workshop.events({
  'click .edit.name.icon'(event, instance) {
    instance.isEditingName.set(true);
  },

  'click .ui.save.name.button'(event, instance) {
    const newName = $('input[name=wedit-name]').val();
    const workshopId = FlowRouter.getParam('_id');
    Meteor.call('workshops.updateName', workshopId, newName);

    instance.isEditingName.set(false);
  },

  'click .edit.desc.icon'(event, instance) {
    instance.isEditingDesc.set(true);
  },

  'click .ui.save.desc.button'(event, instance) {
    const newDesc = $('textarea[name=wedit-desc]').val();
    const workshopId = FlowRouter.getParam('_id');
    Meteor.call('workshops.updateDesc', workshopId, newDesc);

    instance.isEditingDesc.set(false);
  },

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
