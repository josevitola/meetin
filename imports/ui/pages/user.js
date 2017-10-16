import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Workshops } from '/imports/api/workshops.js';
import '../components/workshopCard.js';
import './user.html';

Template.user.onCreated(function() {
  Meteor.subscribe('users');
  Meteor.subscribe('workshops');
})

Template.user.helpers({
  user() {
    return Meteor.users.findOne(FlowRouter.getParam('_id'));
  },
  isUser(user) {
    return Meteor.userId() === user._id;
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
