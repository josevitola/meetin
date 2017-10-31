import { Template } from 'meteor/templating';

import { Files } from '/imports/lib/core.js';
import './settings.html';

Template.settings.onCreated(function settingsOnCreated() {
  this.active = new ReactiveVar('profile');
});

Template.settings.onRendered(function() {
  document.title = 'Configuración | Meetin';
})

Template.settings.helpers({
  profile() {
    return Template.instance().active.get() === 'profile';
  },
  account() {
    return Template.instance().active.get() === 'account';
  },
});

Template.settings.events({
  'click .profile.item'(event, instance) {
    instance.active.set('profile');
  },
  'click .account.item'(event, instance) {
    instance.active.set('account');
  },
});

/***** profileSettings ******/
Template.profileSettings.onCreated(function profileSettingsOnCreated() {
  this.subscribe('files.images.all');

  this.currentUpload = new ReactiveVar(false);
  this.previewSrc = new ReactiveVar('');
  this.labelName = new ReactiveVar('');

  console.log(Files);
});

Template.profileSettings.helpers({
  currentUpload() {
    return Template.instance().currentUpload.get();
  },
  previewSrc() {
    return Template.instance().previewSrc.get();
  },
  label() {
    return Template.instance().labelName.get();
  },
  picSrc(profile) {
    if(profile.photo){
      return profile.photo;
    }else {
      return 'https://robohash.org/'+ profile.name + '.png?size=300x300';
    }
  }
});

Template.profileSettings.events({
  'submit form.user.update'(event) {
    event.preventDefault();

    const newName = $('input[name=update-name]').val();
    const newPhone = parseInt($('input[name=update-phone]').val().trim());
    const newDesc = $('textarea[name=update-desc]').val();

    if(Meteor.user().profile.name !== newName) {
      Meteor.call('user.updateName', newName, (error, result) => {
        if(error) {
          alert(error.message);
        }
      });
    }
    if(Meteor.user().profile.phone !== newPhone) {
      Meteor.call('user.updatePhone', newPhone, (error, result) => {
        if(error) {
          alert(error.message);
        }
      });
    }
    if(Meteor.user().profile.desc !== newDesc) {
      Meteor.call('user.updateDesc', newDesc, (error, result) => {
        if(error) {
          alert(error.message);
        }
      });
    }

    $('.ui.success.update.message').removeClass('hidden');
  },
  'change #imageInput'(e, instance) {
    const files = e.currentTarget.files;
    console.log(files);
    if (files.length > 0) {
      // change preview image
      var reader = new FileReader();

      reader.onload = function(e) {
        console.log(e);
        console.log(instance);
        $('.profile.pic.image')[0].src = reader.result;
      }

      reader.readAsDataURL(files[0]);
      instance.labelName.set(files[0].name);
    }
  },
  'click .ui.button.ok'(event, instance) {
    let images = $('#imageInput')[0].files;
    if(images.length > 0) {
      var reader = new FileReader();
      reader.onload = function(e) {
        Meteor.call('user.updatePhoto', reader.result, images[0].type);
      };
      reader.readAsBinaryString(images[0]);
    }

    //$('#imageInput').val('');
    instance.previewSrc.set('');
    instance.labelName.set('');
  },
  'click .ui.file.button'() {
    $('#imageLabel').click();
  },
  'click .ui.cancel.button'(event, instance) {
    $('#imageInput').val('');
    instance.previewSrc.set('');
    instance.labelName.set('');
  }
});

Template.accountSettings.events({
  'click .ui.delete.user.button'() {
    $('#confirmUserDeleteModal').modal('show');
  },
});

Template.confirmUserDeleteModal.onRendered(function() {
  $('#confirmUserDeleteModal').modal({
    onDeny: function(){
      $('#confirmUserDeleteModal').modal('hide');
      return false;
    },
    onApprove: function() {
      Meteor.call('user.selfDelete', (error, result) => {
        if(!error) {
          FlowRouter.go('/');
        } else {
          alert(error.message);
        }
      });
    }
  });
});
