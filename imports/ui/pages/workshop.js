import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { styleDate, styleShortDate, formatTime } from '/imports/lib/stylish.js';
import { isToday } from '/imports/lib/clock.js';

import { Files } from '/imports/lib/core.js';
import { Comments } from '/imports/api/comments.js';
import { Workshops } from '/imports/api/workshops.js';
import { Email } from 'meteor/email';
import './workshop.html';

const pLimit = 6;

// TODO pop up when error occurs (event is deleted)
Template.workshop.onCreated(function workshopOnCreated() {
  this.subscribe('files.images.all');
  this.subscribe('users');
  this.subscribe('workshops');

  this.isEditingName = new ReactiveVar(false);
  this.isEditingDesc = new ReactiveVar(false);
  this.isEditingCapacity = new ReactiveVar(false);
  this.isEditingInitDate = new ReactiveVar(false);
  this.isEditingInitTime = new ReactiveVar(false);
  this.isEditingEndTime = new ReactiveVar(false);
  this.isEditingTag = new ReactiveVar(false);
  this.isEditingItems = new ReactiveVar(false);
  this.isEditingAddr = new ReactiveVar(false);
  this.isEditingPrice = new ReactiveVar(false);

  this.workshop = new ReactiveVar({});

  this.getParam = () => FlowRouter.getParam('_id');

  this.autorun(() => {
    var param = this.getParam();
    this.subscribe('comments', param);
    this.workshop.set(Workshops.findOne(param));
  })
});

Template.workshop.onRendered(function workshopOnRendered() {
  // initialize SemanticUI components
  $('.ui.accordion').accordion();
  $('#initDate').calendar();
  $('#endDate').calendar();
  $('.ui.named.avatar.image').popup();

  $('.ui.email.form').hide();
});

Template.workshop.helpers({
  isUserAttending() {
    if(!Meteor.user()) {
      return;
    }
    return Meteor.user().profile.attendsTo.indexOf(FlowRouter.getParam('_id')) > -1;
  },
  getUserName(ownerId) {
    const owner = Meteor.users.findOne(ownerId);
    if(owner) {
      return owner.profile.name;
    }
  },
  lengthOf(array) {
    return array.length;
  },
  remain(participants) {
    return participants.length > pLimit;
  },
  firstParticipants(participants) {
    if(participants.length > pLimit) {
      return participants.slice(0, pLimit);
    } else {
      return participants;
    }
  },
  profilePicSrc(userId) {
    if(userId) {
      const user = Meteor.users.findOne(userId);
      if(user) {
        const image = Files.Images.findOne(user.profile.photo);
        if(image) {
          return image.link();
        }
      }
    }
    return 'https://robohash.org/default.png?size=150x150';
  },
  getImageLink() {
    let pics = Template.instance().workshop.get().pics;
    if(pics) {
      let image = Files.Images.findOne({_id: pics[0]});
      if(image) {
        return image.link();
      }
    }
    return '/default.png';
  },
  getUserName( id ) {
    let user = Meteor.users.findOne(id);
    if(user) {
      return user.profile.name;
    }
  },
  comments() {
    return Comments.find().fetch();
  },
  isCurrentUserOwner() {
    return Template.instance().workshop.get().owner === Meteor.userId();
  },
  isEditingName() {
    return Template.instance().isEditingName.get();
  },
  isEditingDesc() {
    return Template.instance().isEditingDesc.get();
  },
  isEditingTag() {
    return Template.instance().isEditingTag.get();
  },
  isEditingItems() {
    return Template.instance().isEditingItems.get();
  },
  isEditingAddr() {
    return Template.instance().isEditingAddr.get();
  },
  isEditingPrice() {
    return Template.instance().isEditingPrice.get();
  },
  isEditingCapacity() {
    return Template.instance().isEditingCapacity.get();
  },
  isEditingInitDate() {
    return Template.instance().isEditingInitDate.get();
  },
  isEditingInitTime() {
    return Template.instance().isEditingInitTime.get();
  },
  isEditingEndTime() {
    return Template.instance().isEditingEndTime.get();
  },
  styleDate(date) {
    return styleDate(date);
  },
  formatTime(time) {
    return formatTime(time);
  },
  datetime(date) {
    var day = '';
    if(isToday(date)) {
      day = 'Hoy';
    } else {
      day = styleShortDate(date);
    }
    return day + " a las " + formatTime(date);
  },
  workshop() {
    return Template.instance().workshop.get();
  },
  capacityAvailable() {
    let workshop = Template.instance().workshop.get();
    return workshop.capacity - workshop.participants.length > 0;
  }
});

Template.workshop.events({
  /* == DATA == */
  /* --- name --- */
  'click .edit.name.icon'(event, instance) {
    instance.isEditingName.set(true);
  },

  'click .ui.save.name.button'(event, instance) {
    const newName = $('input[name=wedit-name]').val();
    const workshopId = FlowRouter.getParam('_id');
    Meteor.call('workshops.update', workshopId, {name:newName});
    instance.isEditingName.set(false);
  },

  /* --- description --- */
  'click .edit.desc.icon'(event, instance) {
    instance.isEditingDesc.set(true);
  },

  'click .ui.save.desc.button'(event, instance) {
    const newDesc = $('textarea[name=wedit-desc]').val();
    const workshopId = FlowRouter.getParam('_id');
    Meteor.call('workshops.update', workshopId, {desc: newDesc});

    instance.isEditingDesc.set(false);
  },

  /* --- tags --- */
  'click .create.tag.icon'(event, instance) {
    instance.isEditingTag.set(true);
  },

  'click .ui.save.tag.button'(event, instance) {
    const tag = $('input[name=wedit-tag]').val();
    if(tag){
      const workshopId = FlowRouter.getParam('_id');
      Meteor.call('workshops.createTag', workshopId, tag);
    }
    instance.isEditingTag.set(false);
  },

  'click .delete.tag.icon'(event) {
    const workshopId = FlowRouter.getParam('_id');
    const target = event.currentTarget;
    Meteor.call('workshops.deleteTag', workshopId, $(target.parentNode).data('idx'));
  },
  /* --- items list --- */

  'click .edit.items.icon'(event, instance) {
    instance.isEditingItems.set(true);
  },

  'click .ui.add.item.button'(event, instance) {
    const item = $('input[name=wedit-item]').val();
    if(item.trim().length !== 0) {
      const workshopId = FlowRouter.getParam('_id');
      Meteor.call('workshops.createItem', workshopId, item);
    }
    $('input[name=wedit-item]').val("");
    $('input[name=wedit-item]').focus();
  },

  'click .item.delete.icon'(event, instance) {
    const target = event.currentTarget.parentNode.parentNode.parentNode;
    let idx = $(target).data("idx");
    const workshopId = FlowRouter.getParam('_id');
    Meteor.call('workshops.deleteItem', workshopId, $(target).data("idx"));
  },

  'click .ui.save.items.button'(event, instance) {
    instance.isEditingItems.set(false);
  },

  /* --- Address---*/
  'click .edit.addr.icon'(event, instance) {
    instance.isEditingAddr.set(true);
  },

  'click .ui.save.addr.button'(event, instance) {
    const newAddr = $('input[name=wedit-addr]').val();
    const workshopId = FlowRouter.getParam('_id');
    Meteor.call('workshops.update', workshopId, { addr: newAddr});
    instance.isEditingAddr.set(false);
  },
  /* --- Price --- */
  'click .edit.price.icon'(event, instance) {
    instance.isEditingPrice.set(true);
  },

  'click .ui.save.price.button'(event, instance) {
    const newPrice = $('input[name=wedit-price]').val();
    if(+newPrice){
      const workshopId = FlowRouter.getParam('_id');
      Meteor.call('workshops.update', workshopId, { price: newPrice});
      instance.isEditingPrice.set(false);
    }
  },
  /* --- Capacity --- */
  'click .edit.capacity.icon'(event, instance) {
    instance.isEditingCapacity.set(true);
  },

  'click .ui.save.capacity.button'(event, instance) {
    const newCapacity = $('input[name=wedit-capacity]').val();
    if(+newCapacity){
      const workshopId = FlowRouter.getParam('_id');
      Meteor.call('workshops.update', workshopId, { capacity: newCapacity});
      instance.isEditingCapacity.set(false);
    }
  },
  /* --- Init Date---*/
  'click .edit.initDate.icon'(event, instance) {
    instance.isEditingInitDate.set(true);
    setTimeout(function () {
      $('#initDate').calendar({
        onChange: function (date, text, mode) {
          const workshopId = FlowRouter.getParam('_id');
          Meteor.call('workshops.update', workshopId, { initDate: date});
          instance.isEditingInitDate.set(false);
        }
      });
    }, 100);
  },

  /* --- Init Time---*/
  'click .edit.initTime.icon'(event, instance) {
    instance.isEditingInitTime.set(true);
    setTimeout(function () {
      $('#initTime').calendar({
        type: 'time',
        onChange: function (date, text, mode) {
          const workshopId = FlowRouter.getParam('_id');
          Meteor.call('workshops.update', workshopId, { initTime: date});
          instance.isEditingInitTime.set(false);
        }
      });
    }, 100);
  },



  'click .ui.join.workshop.button'(event, instance) {
    if(Meteor.user()) {
      let workshops = Meteor.user().profile.attendsTo;
      const workId = FlowRouter.getParam('_id');
      const isUserAttending = Meteor.user().profile.attendsTo.indexOf(FlowRouter.getParam('_id')) > -1;

      if(workshops.indexOf(workId) !== -1) {
        Meteor.call('workshops.pullParticipant', workId, (error, result) => {
          if(error) {
            alert(error.message);
          }
        });
      } else {
        Meteor.call('workshops.pushParticipant', workId, (error, result) => {
          if(error) {
            alert(error.message);
          }
        });

        const workshop = Workshops.findOne(FlowRouter.getParam('_id'));
        workshop.initDate = styleDate(workshop.initDate);
        workshop.initTime = formatTime(workshop.initTime);
        const owner = Meteor.users.findOne(workshop.owner)
        const message = {
          ownerName: owner.profile.name,
          attendantEmail: Meteor.user().emails[0].address,
          attendantName: Meteor.user().profile.name,
          attendantPhoto: Meteor.user().profile.photo,
          workshop: workshop
        }

        Meteor.call('email.notifyAttendant', message, (error, result) => {
          if(error) {
            console.log(error.message);
          } else {
            console.log('Mensaje enviado');
          }
        });
      }
    } else {
      $("#loginModal").modal('show');
    }
  },


  /* === DELETE === */
  'click a.delete.event'() {
    $('#confirmDeleteModal').modal('show');
  },

  'click .watch.participants'() {
    $('#participantsModal').modal('show');
  },

  // toggle email message field
  'click .ui.email.organizer.button'() {
    $('.ui.email.form').transition('slide down');
  },

  // send email to workshop organizer
  'click .ui.send.email.button'(e, instance) {
    const message = $('#emailToOwner').val();
    if(Meteor.user()) {
      Meteor.call('email.toWorkshopOrganizer', instance.workshop.get(), message, (error, result) => {
        if(error) {
          alert(error.message);
        } else {
          $('.ui.form').transition('slide down');
          $('.ui.success.message').transition('slide down');
        }
      });
    }
  },

  'click .ui.submit.button'(e, instance) {
    var content = $('textarea[name=new-comment]').val();
    // TODO shouldn't post an empty comment (client)

    Meteor.call('comments.insert', content, instance.workshop.get()._id, (error, result) => {
      if(error) {
        alert(error.message);
      } else {
        $('textarea[name=new-comment]').val('');
        instance.subscribe('comments', 7);
      }
    });
  }
});

Template.confirmDeleteModal.onRendered(function cdModalOnRendered() {
  $("#confirmDeleteModal").modal({
    onDeny: function(){
      $("#confirmDeleteModal").modal('hide');
      return false;
    },
    onApprove: function() {
      const id = FlowRouter.getParam('_id');

      // TODO smoothen page refreshing when event is deleted
      Meteor.call('workshops.delete', id, (error, result) => {
        if(error) {
          alert(error.message);
        } else {
          FlowRouter.go('/');
          $("#confirmDeleteModal").modal('hide');
        }
      });
    }
  });
});

Template.participantsModal.onDestroyed(function() {
  $('#participantsModal').modal('hide');
})

Template.participantsModal.helpers({
  getUserName( id ) {
    let user = Meteor.users.findOne(id);
    if(user) {
      return user.profile.name;
    }
  },
  profilePicSrc(userId) {
    if(userId) {
      const user = Meteor.users.findOne(userId);
      if(user) {
        const image = Files.Images.findOne(user.profile.photo);
        if(image) {
          return image.link();
        }
      }
    }
    return 'https://robohash.org/default.png?size=300x300';
  },
});
