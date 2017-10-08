import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Workshops } from '/imports/api/workshops.js';

import './workshopCard.html';

Template.workshopCard.onCreated(function wsCardOnCreated() {
  this.workshop = new ReactiveVar(Workshops.findOne({_id: this.data.id}));
});

Template.workshopCard.onRendered(function wsCardOnRendered() {
  var id = Template.instance().workshop.get().owner;
  var title = Meteor.users.findOne({_id: id}).profile.name;
  var item = ".ui.named.avatar.image";
  $(item).popup(title: title);
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
  },
  getWorkshopInitDate() {
    return formatDate(Template.instance().workshop.get().initDate);
  },
  getWorkshopEndDate() {
    return formatDate(Template.instance().workshop.get().endDate);
  },
  getWorkshopInitTime() {
    return formatTime(Template.instance().workshop.get().initDate);
  },
  getWorkshopEndTime() {
    return formatTime(Template.instance().workshop.get().endDate);
  }
});

function formatDate(date) {
  var monthNames = [
    "Enero", "Febrero", "Marzo",
    "Abril", "Mayo", "Junio", "Julio",
    "Agosto", "Septiembre", "Octubre",
    "Noviembre", "Diciembre"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return day + '/' + monthIndex + '/' + year;
}

function formatTime(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes().toString();
  if(minutes.length == 1) {
    minutes = '0' + minutes;
  }

  return hours + ':' + minutes;
}
