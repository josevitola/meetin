import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Files } from '/imports/lib/core.js';
import { Workshops } from '/imports/api/workshops.js';
import '../components/workshopCard.js';
import './user.html';

Template.user.onCreated(function() {
  Meteor.subscribe('users');
  Meteor.subscribe('workshops');
});

Template.user.helpers({
  user() {
    const user = Meteor.users.findOne(FlowRouter.getParam('_id'));
    if(user) {
      document.title = user.profile.name + " | Meetin";
    }
    return user;
  },
  isUser(user) {
    return Meteor.userId() === user._id;
  },
  picSrc(picId) {
    if(picId) {
      const image = Files.Images.findOne(picId);
      if(image) {
        return image.link();
      }
    }
    return 'https://robohash.org/default.png?size=300x300';
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
