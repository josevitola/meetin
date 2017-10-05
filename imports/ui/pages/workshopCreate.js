import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Workshops } from '/imports/api/workshops.js';
import './workshopCreate.html';

Template.workshopCreate.onCreated(function workCreateOnCreated() {
  this.items = new ReactiveVar([]);
  this.tags = new ReactiveVar([]);
});

Template.workshopCreate.helpers({
  items() {
    return Template.instance().items.get();
  },
  tags() {
    return Template.instance().tags.get();
  }
});

Template.workshopCreate.events({
  'click .ui.create.workshop.button' (event, instance) {
    // TODO security on field - stop creation if price is NaN
    const name = $('input[name=work-name]').val();
    const addr = $('input[name=work-addr]').val();
    const desc = $('textarea[name=work-desc]').val();
    const price = parseInt($('input[name=work-price]').val());
    const tags = instance.tags.get();
    const items = instance.items.get();
    const participants = [];

    const workshop = {
      name: name,
      addr: addr,
      desc: desc,
      participants: participants,
      price: price,
      tags: tags,
      items: items,
      owner: Meteor.userId()
    }

    Meteor.call('workshops.insert', workshop, (error, result) => {
      let workshopUrl = "/workshops/" + result;
      FlowRouter.go(workshopUrl);
    });
  },

  'click .ui.add.tag.button'(event, instance) {
    const tag = $('input[name=work-tags]').val();
    if(tag.trim().length !== 0) {
      const instanceTags = instance.tags.get();
      instanceTags.push(tag);
      instance.tags.set(instanceTags);
    }

    $('input[name=work-tags]').val('');
    $('input[name=work-tags]').focus();
  },

  'click .tag.delete.icon'(event, instance) {
    const target = event.currentTarget;
    const textContent = target.parentNode.textContent.trim();

    const instanceTags = instance.tags.get();
    let tagIdx = instanceTags.indexOf(textContent);

    instanceTags.splice(tagIdx, 1);
    instance.tags.set(instanceTags);
  },

  'click .ui.add.item.button'(event, instance) {
    const item = $('input[name=work-items]').val();
    if(item.trim().length !== 0) {
      const instanceItems = instance.items.get();
      instanceItems.push(item);
      instance.items.set(instanceItems);
    }

    $('input[name=work-items]').val("");
    $('input[name=work-items]').focus();
  },

  'click .item.delete.icon'(event, instance) {
    const target = event.currentTarget.parentNode.parentNode.parentNode;
    let idx = $(target).data("idx");

    const instanceItems = instance.items.get();
    instanceItems.splice(idx, 1);
    instance.items.set(instanceItems);
  },
});
