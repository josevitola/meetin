import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { toggle } from '/imports/lib/datahelpers.js';
import { Workshops } from '/imports/api/workshops.js';
import './workshop.html';

// TODO pop up when error occurs (event is deleted)

Template.workshop.onCreated(function workshopOnCreated() {
  Tracker.autorun(() => {
    ws = Workshops.find(FlowRouter.getParam('_id')).fetch()[0];
    if(!ws) {
      FlowRouter.go('/');
    } else {
      this.ws = new ReactiveVar(ws);
    }
  });

  this.isEditingName = new ReactiveVar(false);
  this.isEditingDesc = new ReactiveVar(false);
  this.isEditingList = new ReactiveVar(false);
  this.isEditingAddr = new ReactiveVar(false);
  this.isEditingPrice = new ReactiveVar(false);
});

Template.workshop.onRendered(function workshopOnRendered() {
  if(Meteor.user() || Meteor.loggingIn()) {
    $('.ui.accordion').accordion();
  }
})

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
  // name
  'click .edit.name.icon'(event, instance) {
    instance.isEditingName.set(true);
  },

  'click .ui.save.name.button'(event, instance) {
    const newName = $('input[name=wedit-name]').val();
    const workshopId = FlowRouter.getParam('_id');
    Meteor.call('workshops.updateName', workshopId, newName);

    instance.isEditingName.set(false);
  },

  // desc
  'click .edit.desc.icon'(event, instance) {
    instance.isEditingDesc.set(true);
  },

  'click .ui.save.desc.button'(event, instance) {
    const newDesc = $('textarea[name=wedit-desc]').val();
    const workshopId = FlowRouter.getParam('_id');
    Meteor.call('workshops.updateDesc', workshopId, newDesc);

    instance.isEditingDesc.set(false);
  },

  // tags
  'click .delete.tag.icon'(event) {
    const workshopId = FlowRouter.getParam('_id');
    const target = event.currentTarget;
    Meteor.call('workshops.deleteTag', workshopId, $(target.parentNode).data('idx'));
  },

  'click .ui.join.workshop.button'(event, instance) {
    let workshops = Meteor.user().profile.attendsTo;
    const workId = FlowRouter.getParam('_id');

    Meteor.call('user.updateOwnAttendsTo', toggle(workshops, workId));
    Meteor.call('workshops.setUserAsParticipant', workId);
  },

  'click .ui.edit.button'(event, instance) {
    instance.isEditing.set(true);
  },

  /* === DELETE === */
  'click a.delete.event'(event, instance) {
    $('#confirmDeleteModal').modal('show');
  }
});

Template.confirmDeleteModal.onRendered(function cdModalOnRendered() {
  $("#confirmDeleteModal").modal({
    onDeny: function(){
      // $("#confirmDeleteModal").modal('hide');
      return false;
    },
    onApprove: function() {
      const id = FlowRouter.getParam('_id');
      $("#confirmDeleteModal").modal('hide');

      // TODO smoothen page refreshing when event is deleted
      FlowRouter.go('/');
      Meteor.call('workshops.delete', id, (error, result) => {
        if(!error) {
          FlowRouter.go('/');
        }
      });
    }
  });
})
