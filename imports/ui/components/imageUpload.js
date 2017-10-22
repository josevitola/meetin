import { Template } from 'meteor/templating';
import { Images } from '/imports/api/files.js';

import './imageUpload.html';

Template.imageUpload.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
  this.previewSrc = new ReactiveVar('');
});

Template.imageUpload.helpers({
  currentUpload() {
    return Template.instance().currentUpload.get();
  },
  previewSrc() {
    return Template.instance().previewSrc.get();

  },
  labelName() {
    const files = $('#imageInput').files;
    console.log(files);
    if(files && files.length > 0) {
      return files.length + ' archivos seleccionados';
    } else {
      return 'Escoger un archivo';
    }
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
    }
  }
});
