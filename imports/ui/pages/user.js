import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Files } from '/imports/lib/core.js';
import { Workshops } from '/imports/api/workshops.js';

import '../components/workshopCard.js';
import './user.html';

Template.user.onCreated(function() {
  Meteor.subscribe('users');
  Meteor.subscribe('workshops');

  this.user = new ReactiveVar({});

  this.getParam = () => FlowRouter.getParam('_id');

  this.autorun(() => {
    this.user.set(Meteor.users.findOne(this.getParam()));
  });
});

Template.user.helpers({
  user() {
    const user = Template.instance().user.get();
    if(user) {
      document.title = user.profile.name + " | Meetin";
    }
    return user;
  },
  isCurrentUser() {
    return Meteor.userId() === Template.instance().user.get()._id;
  },
  picSrc(picId) {
    if(picId) {
      const image = Files.Images.findOne(picId);
      if(image) {
        return image.link();
      }
    }
    return '/userDefault.gif';
  },
  getOwnedWorkshops() {
    // TODO decide whether to use double reference in database or not
    const userId = FlowRouter.getParam('_id');
    return Workshops.find({owner: userId}).fetch();
  },
  getAttendsTo(attendsTo) {
    return Workshops.find({
      _id: {
        $in : attendsTo
      }
    }).fetch();
  }
});

Template.user.events({
  'click .ui.email.organizer.button'() {
    $('.ui.email.form').transition('slide down');
  },

  // send email to workshop organizer
  'click .ui.send.email.button'(e, instance) {
    const message = $('#emailToUser').val();

    if(Meteor.user()) {
      Meteor.call('email.toUser', FlowRouter.getParam('_id'), message, (error, result) => {
        if(error) {
          alert(error.message);
        } else {
          $('.ui.form').transition('slide down');
          $('.ui.success.message').transition('slide down');
        }
      });
    }
  },

  'click .ui.settings.button'() {
    FlowRouter.go('/settings');
  }
});
