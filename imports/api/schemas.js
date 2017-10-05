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
  'profile.workshops': { type: Array },
  'profile.workshops.$': { type: String },
  'profile.phone': { type: Number },
  'profile.desc': { type: String },
  // 'profile.tags': { type: Array },
  // 'profile.tags.$': { type: String }
});

export const WorkshopSchema = new SimpleSchema({
  name: { type: String },
  owner: { type: String },
  addr: { type: String },
  desc: { type: String, optional: true },
  price: { type: Number },
  tags: { type: Array },
  'tags.$': { type: String },
  participants: { type: Array },
  'participants.$': { type: String },
  items: { type: Array },
  'items.$': { type: String }
});
