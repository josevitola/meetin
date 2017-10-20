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
  photo: { type: String },
  owner: { type: String },
  addr: { type: String },
  desc: { type: String, optional: true },
  initDate: { type: Date },
  endDate: { type: Date },
  price: { type: Number },
  tags: { type: Array },
  'tags.$': { type: String },
  participants: { type: Array },
  'participants.$': { type: String },
  items: { type: Array },
  'items.$': { type: String },
});

export const NotificationSchema = new SimpleSchema({
  sender: { type: String },
  receiver: { type: String },
  type: { type: String },
  event: { type: String },
  createdAt: { type: Date },
  read: { type: Boolean }
});
