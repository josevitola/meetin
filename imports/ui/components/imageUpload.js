import { Template } from 'meteor/templating';

import './imageUpload.html';

Template.imageUpload.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
  this.previewSrc = new ReactiveVar('');
  this.labelName = new ReactiveVar('Adjuntar imagen');
});

Template.imageUpload.helpers({
  currentUpload() {
    return Template.instance().currentUpload.get();
  },
  previewSrc() {
    return Template.instance().previewSrc.get();

  },
  labelName() {
    return Template.instance().labelName.get();
  }
});

Template.imageUpload.events({
  'change #imageInput'(e, instance) {
    const files = e.currentTarget.files;
    if (files && files[0]) {
      // change preview image
      var reader = new FileReader();

      reader.onload = function(e) {
        instance.previewSrc.set(e.target.result);
      }

      reader.readAsDataURL(files[0]);

      instance.labelName.set(files[0].name);
    }
  },
  'click .ui.remove.label'(e, instance) {
    $('#imageInput').val('');
    instance.previewSrc.set('');
    instance.labelName.set('Adjuntar imagen');
  }
});
