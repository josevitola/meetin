import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { toggle } from '/imports/lib/datahelpers.js';
import { Workshops } from '/imports/api/workshops.js';
import './workshop.html';

// TODO pop up when error occurs (event is deleted)
Template.workshop.onCreated(function workshopOnCreated() {
  this.isEditingName = new ReactiveVar(false);
  this.isEditingDesc = new ReactiveVar(false);
  this.isEditingInitDate = new ReactiveVar(false);
  this.isEditingEndDate = new ReactiveVar(false);
  this.isEditingTag = new ReactiveVar(false);
  this.isEditingItems = new ReactiveVar(false);
  this.isEditingAddr = new ReactiveVar(false);
  this.isEditingPrice = new ReactiveVar(false);
});

Template.workshop.onRendered(function workshopOnRendered() {
  if(Meteor.user() || Meteor.loggingIn()) {
    $('.ui.accordion').accordion();
  }
  $('#initDate').calendar();
  $('#endDate').calendar();

  // var id = Template.instance().workshop.get().owner;
  // var title = Meteor.users.findOne({_id: id}).profile.name;
  var item = ".ui.named.avatar.image";
  $(item).popup();
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
  getUserName( id ) {
    return Meteor.users.findOne(id).profile.name;
  },
  isUserOwner(ownerId) {
    return Meteor.userId() === ownerId;
  },
  isEditingName() {
    return Template.instance().isEditingName.get();
  },
  isEditingDesc() {
    return Template.instance().isEditingDesc.get();
  },
  isEditingTag() {
    return Template.instance().isEditingTag.get();
  },
  isEditingItems() {
    return Template.instance().isEditingItems.get();
  },
  isEditingAddr() {
    return Template.instance().isEditingAddr.get();
  },
  isEditingPrice() {
    return Template.instance().isEditingPrice.get();
  },
  isEditingInitDate() {
    return Template.instance().isEditingInitDate.get();
  },
  isEditingEndDate() {
    return Template.instance().isEditingEndDate.get();
  },
  exist() {
    return Workshops.findOne(FlowRouter.getParam('_id'));
  }
});

Template.workshop.events({
  /* == DATA == */
  /* --- name --- */
  'click .edit.name.icon'(event, instance) {
    instance.isEditingName.set(true);
  },

  'click .ui.save.name.button'(event, instance) {
    const newName = $('input[name=wedit-name]').val();
    const workshopId = FlowRouter.getParam('_id');
    Meteor.call('workshops.update', workshopId, {name:newName});
    instance.isEditingName.set(false);
  },

  /* --- description --- */
  'click .edit.desc.icon'(event, instance) {
    instance.isEditingDesc.set(true);
  },

  'click .ui.save.desc.button'(event, instance) {
    const newDesc = $('textarea[name=wedit-desc]').val();
    const workshopId = FlowRouter.getParam('_id');
    Meteor.call('workshops.update', workshopId, {desc: newDesc});

    instance.isEditingDesc.set(false);
  },

  /* --- tags --- */
  'click .create.tag.icon'(event, instance) {
    instance.isEditingTag.set(true);
  },

  'click .ui.save.tag.button'(event, instance) {
    const tag = $('input[name=wedit-tag]').val();
    if(tag){
      const workshopId = FlowRouter.getParam('_id');
      Meteor.call('workshops.createTag', workshopId, tag);
    }
    instance.isEditingTag.set(false);
  },

  'click .delete.tag.icon'(event) {
    const workshopId = FlowRouter.getParam('_id');
    const target = event.currentTarget;
    Meteor.call('workshops.deleteTag', workshopId, $(target.parentNode).data('idx'));
  },
  /* --- items list --- */

  'click .edit.items.icon'(event, instance) {
    instance.isEditingItems.set(true);
  },

  'click .ui.add.item.button'(event, instance) {
    const item = $('input[name=wedit-item]').val();
    if(item.trim().length !== 0) {
      const workshopId = FlowRouter.getParam('_id');
      Meteor.call('workshops.createItem', workshopId, item);
    }
    $('input[name=wedit-item]').val("");
    $('input[name=wedit-item]').focus();
  },

  'click .item.delete.icon'(event, instance) {
    const target = event.currentTarget.parentNode.parentNode.parentNode;
    let idx = $(target).data("idx");
    const workshopId = FlowRouter.getParam('_id');
    Meteor.call('workshops.deleteItem', workshopId, $(target).data("idx"));
  },

  'click .ui.save.items.button'(event, instance) {
    instance.isEditingItems.set(false);
  },

  /* --- Address---*/
  'click .edit.addr.icon'(event, instance) {
    instance.isEditingAddr.set(true);
  },

  'click .ui.save.addr.button'(event, instance) {
    const newAddr = $('input[name=wedit-addr]').val();
    const workshopId = FlowRouter.getParam('_id');
    Meteor.call('workshops.update', workshopId, { addr: newAddr});
    instance.isEditingAddr.set(false);
  },
  /* --- Price --- */
  'click .edit.price.icon'(event, instance) {
    instance.isEditingPrice.set(true);
  },

  'click .ui.save.price.button'(event, instance) {
    const newPrice = $('input[name=wedit-price]').val();
    if(+newPrice){
      const workshopId = FlowRouter.getParam('_id');
      Meteor.call('workshops.update', workshopId, { price: newPrice});
      instance.isEditingPrice.set(false);
    }
  },
  /* --- Init Date---*/
  'click .edit.initDate.icon'(event, instance) {
    instance.isEditingInitDate.set(true);
    setTimeout(function () {
      $('#initDate').calendar({
        onChange: function (date, text, mode) {
          const workshopId = FlowRouter.getParam('_id');
          Meteor.call('workshops.update', workshopId, { initDate: date});
          instance.isEditingInitDate.set(false);
        }
      });
    }, 100);
  },


  /* --- End Date---*/
  'click .edit.endDate.icon'(event, instance) {
    instance.isEditingEndDate.set(true);
    setTimeout(function () {
      $('#endDate').calendar({
        minDate: new Date($('.content.initDate').text()),
        onChange: function (date, text, mode) {
          const workshopId = FlowRouter.getParam('_id');
          Meteor.call('workshops.update', workshopId, { endDate: date});
          instance.isEditingEndDate.set(false);
        }
      });
    }, 100);
  },

  'click .ui.save.addr.button'(event, instance) {
    const newEndDate = $('input[name=wedit-endDate]').calendar("get date");
    const workshopId = FlowRouter.getParam('_id');
    Meteor.call('workshops.update', workshopId, { endDate: newEndDate});
    instance.isEditingEndDate.set(false);
  },


  'click .ui.join.workshop.button'(event, instance) {
    if(Meteor.user()){
      let workshops = Meteor.user().profile.attendsTo;
      const workId = FlowRouter.getParam('_id');

      Meteor.call('user.updateOwnAttendsTo', toggle(workshops, workId));
      Meteor.call('workshops.setUserAsParticipant', workId);
    }else{
      $("#loginModal").modal('show');
    }
  },


  /* === DELETE === */
  'click a.delete.event'(event, instance) {
    $('#confirmDeleteModal').modal('show');
  }
});

Template.confirmDeleteModal.onRendered(function cdModalOnRendered() {
  $("#confirmDeleteModal").modal({
    onDeny: function(){
      $("#confirmDeleteModal").modal('hide');
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
