import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { WorkshopSchema } from '/imports/api/schemas.js';

import { Files } from '/imports/api/server/files';
import { Notifications } from '/imports/api/notifications.js';
import { Workshops } from '/imports/api/workshops.js';

/***** Hooks *****/
Workshops.before.remove((userId, workshop) => {
  // delete attendsTo from users
  for(var i = 0; i < workshop.participants.length; i++) {
    const user = Meteor.users.findOne({_id: workshop.participants[i]});
    user.profile.attendsTo.forEach((workId) => {
      Meteor.call('users.pullAttendsTo', user._id, workId);
    });
  }

  // delete related notifications
  const notifications = Notifications.find({event: workshop._id}).fetch();
  notifications.forEach((notif, index, arr) => {
    Notifications.remove(notif._id);
  });
})

/***** Methods *****/
Meteor.methods({
  /* Inserting */
  'workshops.insert'( workshop ) {
    WorkshopSchema.validate(workshop);
    return Workshops.insert( workshop );
  },

  /* Updating */
  'workshops.addPic'( workId, imageId ) {
    check(imageId, String);

    const image = Images.findOne({_id: imageId});
    if(!image) {
      throw new Meteor.Error(404, 'Imagen no encontrada');
    }

    if(Workshops.findOne(workId).owner !== this.userId) {
      throw new Meteor.Error(403, 'Usuario no autorizado');
    }

    Workshops.update(workId, {
      $push: { pics: imageId }
    });
  },

  'workshops.pushParticipant'( workId ) {
    check(workId, String);

    const workshop = Workshops.findOne(workId);
    if(workshop && workshop.participants.indexOf(this.userId) === -1) {
      // push user in workshop
      Workshops.update(workId, {
        $push: { participants: this.userId }
      });

      // TODO maybe this should go in the collections hooks?
      // push workshop in user
      Meteor.call('users.pushAttendsTo', this.userId, workId);

      // send notification to owner
      Meteor.call('notifications.insert', this.userId,
        workshop.owner, 'join', workId);
    } else {
      throw new Meteor.Error(403, 'Workshop already listed user');
    }
  },
  'workshops.pullParticipant'( workId ) {
    check(workId, String);

    const workshop = Workshops.findOne(workId);
    if(workshop.participants.indexOf(this.userId) !== -1) {
      // pull user from workshop
      Workshops.update(workId, {
        $pull: { participants: this.userId }
      });

      // pull workshop from user
      Meteor.call('users.pullAttendsTo', this.userId, workId);
    } else {
      throw new Meteor.Error(403, 'Workshop has not listed user');
    }
  },
  'workshops.update'( workshopId, newAttr ) {
    const workshop = Workshops.findOne({_id: workshopId});
    if(this.userId === workshop.owner) {
      Workshops.update(workshopId, {
        $set: newAttr
      })
    }
  },
  'workshops.createTag'( workshopId, tag ) {
    check(tag, String);
    const workshop = Workshops.findOne({_id: workshopId});

    if(this.userId === workshop.owner) {
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
      let newTags = workshop.tags;
      newTags.splice(tagIdx, 1);
      Workshops.update(workshopId, {
        $set: { tags: newTags }
      });
    }
  },
  'workshops.createItem'( workshopId, item ) {
    check(item, String);
    const workshop = Workshops.findOne({_id: workshopId});
    if(this.userId === workshop.owner) {
      let newItems = workshop.items;
      newItems.push(item);
      Workshops.update(workshopId, {
        $set: { items: newItems }
      });
    }
  },
  'workshops.deleteItem'( workshopId, itemIdx ) {
    check(itemIdx, Number);
    const workshop = Workshops.findOne({_id: workshopId});

    if(this.userId === workshop.owner) {
      let newItems = workshop.items;
      newItems.splice(itemIdx, 1);
      Workshops.update(workshopId, {
        $set: { items: newItems }
      });
    }
  },
  'workshops.delete'( workshopId ) {
    check(workshopId, String);

    Workshops.remove(workshopId);
  }
});
