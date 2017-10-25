import { Template } from 'meteor/templating';

import { Images } from '/imports/api/files.js';
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
        const image = Images.findOne(picId);
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
      const upload = Images.insert({
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
          // console.log('File "' + fileObj.name + '" successfully uploaded');
          // console.log(fileObj._id);
          Meteor.call('users.updatePhoto', fileObj._id);
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
