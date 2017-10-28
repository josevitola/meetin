import { Mongo } from 'meteor/mongo';
import { CommentSchema } from './schemas.js';

var Comment = new Mongo.Collection('comments');
Comment.attachSchema(CommentSchema);

export const Comments = Comment;
