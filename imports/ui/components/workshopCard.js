import { Template } from 'meteor/templating';

import './workshopCard.html';

Template.workshopCard.helpers({
  getOwnerName(owner) {
    return Meteor.users.find({_id: owner}).fetch()[0].profile.name;
  }
});
