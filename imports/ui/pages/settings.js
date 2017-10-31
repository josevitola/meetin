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
  picSrc(picId) {
    const src = Template.instance().previewSrc.get();
    if(src === '') {
      if(picId) {
        const image = Files.Images.findOne(picId);
        console.log(Files.Images.find({_id: 'tREBxDPFLA7xYYc2C'}).fetch());
        if(image) {
          return image.link();
        } else return 'https://robohash.org/default.png?size=300x300';
      }
    }

    return src;
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
    if (files && files[0]) {
      // change preview image
      var reader = new FileReader();

      reader.onload = function(e) {
        console.log(e);
        instance.previewSrc.set(e.target.result);
      }

      reader.readAsDataURL(files[0]);
      instance.labelName.set(files[0].name);
    }
  },
  'click .ui.button.ok'(event, instance) {
    let images = $('#imageInput')[0].files;
    if(images && images[0]) {
      const upload = Files.Images.insert({
        file: images[0],
        streams: 'dynamic',
        chunkSize: 'dynamic'
      }, false);

      upload.on('start', function () {
        instance.currentUpload.set(this);
      });

      upload.on('end', function (error, fileObj) {
        if (error) {
          alert('Error during upload: ' + error);
        } else {
          console.log('File "' + fileObj.name + '" successfully uploaded');
          console.log(fileObj._id);
          Meteor.call('user.updatePhoto', fileObj._id);
        }
        instance.currentUpload.set(false);
      });

      upload.start();
    }

    $('#imageInput').val('');
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

Template.accountSettings.onCreated(function() {
  this.emptyOldPass = new ReactiveVar(false);
  this.emptyNewPass = new ReactiveVar(false);
  this.emptyConPass = new ReactiveVar(false);
  this.notPass = new ReactiveVar(false);
  this.notMatch = new ReactiveVar(false);
})

Template.accountSettings.helpers({
  emptyOldPass() {
    return Template.instance().emptyOldPass.get();
  },
  emptyNewPass() {
    return Template.instance().emptyNewPass.get();
  },
  emptyConPass() {
    return Template.instance().emptyConPass.get();
  },
  notMatch() {
    return Template.instance().notMatch.get();
  },
});

Template.accountSettings.events({
  'click .ui.change.password.button'(e, instance) {
    e.preventDefault();

    const oldPass = $('input.old.pass').val();
    const newPass = $('input.new.pass').val();
    const conPass = $('input.pass.con').val();

    if(oldPass.trim().length === 0) {
      instance.emptyOldPass.set(true);
    }

    if(newPass.trim().length === 0) {
      instance.emptyNewPass.set(true);
    }

    if(conPass.trim().length === 0) {
      instance.emptyConPass.set(true);
    }

    if(newPass != conPass) {
      console.log(newPass, conPass);
      instance.notMatch.set(true);
    }

    if(!instance.emptyOldPass.get()
        && !instance.emptyNewPass.get()
        && !instance.emptyConPass.get()
        && !instance.notMatch.get()) {
      Accounts.changePassword(oldPass, newPass, (error) => {
        if(error && error.reason === "Incorrect password") {
          $('.ui.error.hidden.message').transition('slide down');
        } else {
          if(!$('.ui.error.message').hasClass('hidden')) {
            $('.ui.error.hidden.message').transition('slide down');
          }
          $('.ui.success.hidden.message').transition('slide down');
          $('input.pass').val('');
        }
      })
    }
  },
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
