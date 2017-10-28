export const UserSchema = new SimpleSchema({
  _id: { type: String },
  emails: { type: Array },
  'emails.$': { type: Object },
  'emails.$.address': { type: String },
  'emails.$.verified': { type: Boolean },
  services: { type: Object, blackbox: true },
  createdAt: { type: Date },
  profile: { type: Object },
  'profile.name': { type: String },
  'profile.photo': { type: String, optional: true },
  'profile.attendsTo': { type: Array },
  'profile.attendsTo.$': { type: String },
  'profile.owns': { type: Array },
  'profile.owns.$': { type: String },
  'profile.phone': { type: Number },
  'profile.desc': { type: String },
  'profile.notifications': { type: Array },
  'profile.notifications.$': { type: String }
  // 'profile.tags': { type: Array },
  // 'profile.tags.$': { type: String }
});

// TODO insert createdAt field
export const WorkshopSchema = new SimpleSchema({
  name: { type: String },
  photo: { type: String, optional: true },
  owner: { type: String },
  addr: { type: String },
  desc: { type: String, optional: true },
  initDate: { type: Date },
  initTime: { type: Date },
  endTime: { type: Date },
  price: { type: Number },
  tags: { type: Array, optional: true },
  'tags.$': { type: String },
  participants: { type: Array },
  'participants.$': { type: String },
  items: { type: Array, optional: true },
  'items.$': { type: String },
  pics: { type: Array, optional: true },
  'pics.$': { type: String },
  capacity: {type : Number}
});

export const NotificationSchema = new SimpleSchema({
  sender: { type: String },
  receiver: { type: String },
  type: { type: String },
  event: { type: String },
  createdAt: { type: Number },
  read: { type: Boolean }
});

export const CommentSchema = new SimpleSchema({
  user: { type: String },
  content: { type: String },
  createdAt: { type: Date },
  event: { type: String }
});
