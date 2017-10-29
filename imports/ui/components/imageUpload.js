import { Template } from 'meteor/templating';

import './imageUpload.html';

Template.imageUpload.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
  this.previewSrc = new ReactiveArray();
  this.labelName = new ReactiveVar('Adjuntar imagen');
});

Template.imageUpload.helpers({
  currentUpload() {
    return Template.instance().currentUpload.get();
  },
  previewSrc() {
    return Template.instance().previewSrc.list();
  },
  labelName() {
    return Template.instance().labelName.get();
  }
});

Template.imageUpload.events({
  'change #imageInput'(e, instance) {
    const files = e.currentTarget.files;
    if (files) {
      // change preview image
      instance.previewSrc.clear();
      for(let i=0; i<files.length; i++){
        var reader = new FileReader();
        reader.onload = function(e) {
          instance.previewSrc.push(e.target.result);
        }
        reader.readAsDataURL(files[i]);
        //instance.labelName.set(files[i].name);
      }
    }
  },
  'click .ui.remove.label'(e, instance) {
    $('#imageInput').val('');
    instance.previewSrc.set('');
    instance.labelName.set('Adjuntar imagen');
  }
});
