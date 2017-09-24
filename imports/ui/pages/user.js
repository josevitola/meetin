import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Workshops } from '/imports/api/workshops.js';
import '../components/workshopCard.js';
import './user.html';

Template.user.onCreated(function userOnCreated() {
  let user = Meteor.users.find(FlowRouter.getParam('_id')).fetch()[0];
  this.user = new ReactiveVar(user);
});

Template.user.helpers({
  getName() {
    return Template.instance().user.get().profile.name;
  },
  getOwnedWorkshops() {
    // TODO decide whether to use double reference in database or not
    const userId = Template.instance().user.get()._id;
    let workshops = Workshops.find({owner: userId}).fetch();
    let ids = [];
    workshops.forEach((element) => {
      ids.push(element._id);
    });
    return ids;
  },
  getWorkshopsToAttend() {
    return Template.instance().user.get().profile.workshops;
  }
});
