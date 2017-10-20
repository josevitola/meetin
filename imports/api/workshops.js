import { Mongo } from 'meteor/mongo';

export const Workshops = new Mongo.Collection('workshops');

if(Meteor.isServer) {
  Meteor.publish('workshops', function () {
    return Workshops.find({});
  })
}
