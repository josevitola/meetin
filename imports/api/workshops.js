import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { toggle } from '/imports/lib/datahelpers.js';
import { WorkshopSchema } from '/imports/api/schemas.js';

export const Workshops = new Mongo.Collection('workshops');

// TODO move methods to safer position in project - visible by client!

Meteor.methods({
  'workshops.insert'( workshop ) {
    WorkshopSchema.validate(workshop);
    return Workshops.insert( workshop );
  },
  'workshops.setUserAsParticipant'( workshopId ) {
    const workshop = Workshops.findOne({_id: workshopId});
    let participants = workshop.participants;
    toggle(participants, this.userId);

     Workshops.update(workshopId, {
      $set: { participants: participants }
    });
  }
});
