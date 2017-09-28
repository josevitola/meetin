import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Workshops } from '/imports/api/workshops.js';

import './workshopCard.html';

Template.workshopCard.onCreated(function wsCardOnCreated() {
  this.workshop = new ReactiveVar(Workshops.findOne({_id: this.data.id}));
});

Template.workshopCard.helpers({
  getWorkshopName() {
    return Template.instance().workshop.get().name;
  },
  getOwnerId() {
    return Template.instance().workshop.get().owner;
  },
  getOwnerName() {
    const id = Template.instance().workshop.get().owner;
    return Meteor.users.findOne({_id: id}).profile.name;
  },
  getWorkshopDesc() {
    return Template.instance().workshop.get().desc;
  },
  getWorkshopAddr() {
    return Template.instance().workshop.get().addr;
  },
  getWorkshopPrice() {
    return Template.instance().workshop.get().price;
  }
});
