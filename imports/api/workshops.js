import { Mongo } from 'meteor/mongo';

export const Workshops = new Mongo.Collection('workshops');

Meteor.methods({
  'workshops.insert'( workshop ) {
    console.log("created!");
    Workshops.insert( workshop );
  }
});
