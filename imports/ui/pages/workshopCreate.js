import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Workshops } from '/imports/api/workshops.js';
import './workshopCreate.html';

Template.workshopCreate.onCreated(function workCreateOnCreated() {
  this.tags = new ReactiveVar([]);
});

Template.workshopCreate.helpers({
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

    const workshop = {
      name: name,
      addr: addr,
      desc: desc,
      price: price,
      tags: tags,
      owner: Meteor.userId()
    }

    Meteor.call('workshops.insert', workshop, (error, result) => {
      let workshopUrl = "/workshops/" + result;
      FlowRouter.go(workshopUrl);
    });
  },

  'click .ui.add.tag.button'(event, instance) {
    const tag = $('input[name=work-tags]').val();
    const instanceTags = instance.tags.get();
    instanceTags.push(tag);
    instance.tags.set(instanceTags);
  },

  'click .delete.icon'(event, instance) {
    const target = event.currentTarget;
    const textContent = target.parentNode.textContent.trim();

    const instanceTags = instance.tags.get();
    let tagIdx = instanceTags.indexOf(textContent);

    instanceTags.splice(tagIdx, 1);
    instance.tags.set(instanceTags);
  }
});
