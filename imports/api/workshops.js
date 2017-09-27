import { Mongo } from 'meteor/mongo';
import { WorkshopSchema} from '/imports/api/schemas.js';

export const Workshops = new Mongo.Collection('workshops');

Meteor.methods({
  'workshops.insert'( workshop ) {
    WorkshopSchema.validate(workshop);
    console.log(workshop.desc);
    return Workshops.insert( workshop );
  }
});
