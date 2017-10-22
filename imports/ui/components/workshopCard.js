import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { formatTime, styleDate, formatPrice } from '/imports/lib/stylish.js';
import { Images } from '/imports/api/files.js';
import { Workshops } from '/imports/api/workshops.js';

import './workshopCard.html';

Template.workshopCard.onCreated(function wsCardOnCreated() {
  this.subscribe('users');
})

Template.workshopCard.onRendered(function wsCardOnRendered() {
  this.autorun(() => {
    var id = this.data.workshop.owner;
    var user = Meteor.users.findOne(id);
    if(user) {
      var item = ".ui.named.avatar.image";
      $(item).popup(user.profile.name);
    }
  });
});

Template.workshopCard.helpers({
  getOwnerName() {
    let ownerId = Template.instance().data.workshop.owner;
    if(Meteor.users.findOne(ownerId)) {
      return Meteor.users.findOne({_id: ownerId}).profile.name;
    }
  },
  getWorkshopDesc() {
    return Template.instance().workshop.get().desc;
  },
  getWorkshopAddr() {
    return Template.instance().workshop.get().addr;
  },
  getImage(imageId) {
    return Images.findOne(imageId);
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
