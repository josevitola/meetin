import { Mongo } from 'meteor/mongo';
import { WorkshopSchema } from './schemas.js';

var Workshop = new Mongo.Collection('workshops');
Workshop.attachSchema(WorkshopSchema);

export const Workshops = Workshop;