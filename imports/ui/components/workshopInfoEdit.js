import { Template } from 'meteor/templating';

import { styleDate, styleShortDate, formatTime, formatPrice } from '/imports/lib/stylish.js';

import './workshopInfoEdit.html';

Template.workshopInfoEdit.onCreated(function() {
  this.isEditingCapacity = new ReactiveVar(false);
  this.isEditingInitDate = new ReactiveVar(false);
  this.isEditingInitTime = new ReactiveVar(false);
  this.isEditingEndTime = new ReactiveVar(false);
  this.isEditingAddr = new ReactiveVar(false);
  this.isEditingPrice = new ReactiveVar(false);
});

Template.workshopInfoEdit.onRendered(function() {
  $('#initDate').calendar();
  $('#endDate').calendar();
});

Template.workshopInfoEdit.helpers({
  isEditingAddr() {
    return Template.instance().isEditingAddr.get();
  },
  isEditingPrice() {
    return Template.instance().isEditingPrice.get();
  },
  isEditingCapacity() {
    return Template.instance().isEditingCapacity.get();
  },
  isEditingInitDate() {
    return Template.instance().isEditingInitDate.get();
  },
  isEditingInitTime() {
    return Template.instance().isEditingInitTime.get();
  },
  isEditingEndTime() {
    return Template.instance().isEditingEndTime.get();
  },
  styleDate(date) {
    return styleDate(date);
  },
  styleShortDate(date) {
    return styleShortDate(date);
  },
  stylePrice(price) {
    return formatPrice(price);
  },
  formatTime(time) {
    return formatTime(time);
  },
});

Template.workshopInfoEdit.events({ 
  //
  // ─── ADDRESS ────────────────────────────────────────────────────────────────────
  //    
  'click .edit.addr.icon'(event, instance) {
    event.preventDefault();
    instance.isEditingAddr.set(true);
  },

  'click .ui.save.addr.button'(event, instance) {
    const newAddr = $('input[name=wedit-addr]').val();
    const workshopId = FlowRouter.getParam('_id');
    Meteor.call('workshops.update', workshopId, { addr: newAddr});
    instance.isEditingAddr.set(false);
  },

  //
  // ─── PRICE ──────────────────────────────────────────────────────────────────────
  //
  'click .edit.price.icon'(event, instance) {
    event.preventDefault();
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

  //
  // ─── CAPACITY ───────────────────────────────────────────────────────────────────
  //
  'click .edit.capacity.icon'(event, instance) {
    event.preventDefault();
    instance.isEditingCapacity.set(true);
  },

  'click .ui.save.capacity.button'(event, instance) {
    const newCapacity = $('input[name=wedit-capacity]').val();
    if(+newCapacity){
      const workshopId = FlowRouter.getParam('_id');
      Meteor.call('workshops.update', workshopId, { capacity: newCapacity});
      instance.isEditingCapacity.set(false);
    }
  },   

  //
  // ─── INIT DATE ──────────────────────────────────────────────────────────────────
  //    
  'click .edit.initDate.icon'(event, instance) {
    event.preventDefault();    
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

  //
  // ─── INIT TIME ──────────────────────────────────────────────────────────────────
  //    
  'click .edit.initTime.icon'(event, instance) {
    event.preventDefault();
    instance.isEditingInitTime.set(true);
    setTimeout(function () {
      $('#initTime').calendar({
        type: 'time',
        onChange: function (date, text, mode) {
          const workshopId = FlowRouter.getParam('_id');
          Meteor.call('workshops.update', workshopId, { initTime: date});
          instance.isEditingInitTime.set(false);
        }
      });
    }, 100);
  },

  // TODO end time
});