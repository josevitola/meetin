import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { toggle } from '/imports/lib/datahelpers.js';
import { WorkshopSchema } from '/imports/api/schemas.js';
import { Workshops } from './workshops.js';

Workshops.after.remove((userId, workshop) => {
  const users = [];
  console.log(workshop.participants.length);
  console.log(workshop.participants);
  for(var i = 0; i < workshop.participants.length; i++) {
    const user = Meteor.users.findOne({_id: workshop.participants[i]});
    let attendsTo = user.profile.attendsTo;
    let idx = attendsTo.indexOf(workshop._id);
    attendsTo.splice(idx, 1);
    Meteor.call('users.updateAttendsTo', user._id, attendsTo);
  }
})

Meteor.methods({
  'workshops.insert'( workshop ) {
    WorkshopSchema.validate(workshop);
    return Workshops.insert( workshop );
  },

  // EDIT METHODS
  'workshops.updateName'( workshopId, newName ) {
    check(newName, String);
    const workshop = Workshops.findOne({_id: workshopId});

    if(this.userId === workshop.owner) {
      Workshops.update(workshopId, {
        $set: { name: newName }
      })
    }
  },
  'workshops.updateDesc'( workshopId, newDesc ) {
    check(newDesc, String);
    const workshop = Workshops.findOne({_id: workshopId});

    if(this.userId === workshop.owner) {
      Workshops.update(workshopId, {
        $set: { desc: newDesc }
      })
    }
  },
  'workshops.createTag'( workshopId, tag ) {
    check(tag, String);
    const workshop = Workshops.findOne({_id: workshopId});

    if(this.userId === workshop.owner) {
      console.log(tag);
      let newTags = workshop.tags;
      newTags.push(tag);
      Workshops.update(workshopId, {
        $set: { tags: newTags }
      });
    }
  },
  'workshops.deleteTag'( workshopId, tagIdx ) {
    check(tagIdx, Number);
    const workshop = Workshops.findOne({_id: workshopId});

    if(this.userId === workshop.owner) {
      console.log(tagIdx);
      let newTags = workshop.tags;
      newTags.splice(tagIdx, 1);
      Workshops.update(workshopId, {
        $set: { tags: newTags }
      });
    }
  },
  'workshops.setUserAsParticipant'( workshopId ) {
    const workshop = Workshops.findOne({_id: workshopId});
    let participants = workshop.participants;
    toggle(participants, this.userId);

     Workshops.update(workshopId, {
      $set: { participants: participants }
    });
  },
  'workshops.delete'( workshopId ) {
    check(workshopId, String);

    Workshops.remove(workshopId);
  }
});
