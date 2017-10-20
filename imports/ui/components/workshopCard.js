import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { formatTime, styleDate, formatPrice } from '/imports/lib/stylish.js';
import { Workshops } from '/imports/api/workshops.js';

import './workshopCard.html';

Template.workshopCard.onRendered(function wsCardOnRendered() {
  var id = this.data.workshop.owner;
  var title = Meteor.users.findOne({_id: id}).profile.name;
  var item = ".ui.named.avatar.image";
  $(item).popup(title: title);
});

Template.workshopCard.helpers({
  getOwnerName(ownerId) {
    return Meteor.users.findOne({_id: ownerId}).profile.name;
  },
  getWorkshopDesc() {
    return Template.instance().workshop.get().desc;
  },
  getWorkshopAddr() {
    return Template.instance().workshop.get().addr;
  },
  formatPrice(price) {
    return formatPrice(price);
  },
  formatDate(date) {
    return styleDate(date);
  },
  formatTime(date) {
    return formatTime(date);
  }
});
