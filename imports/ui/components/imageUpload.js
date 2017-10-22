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

      // We upload only one file, in case
      // multiple files were selected

      // const upload = Images.insert({
      //   file: e.currentTarget.files[0],
      //   streams: 'dynamic',
      //   chunkSize: 'dynamic'
      // }, false);
      //
      // upload.on('start', function () {
      //   instance.currentUpload.set(this);
      // });
      //
      // upload.on('end', function (error, fileObj) {
      //   if (error) {
      //     alert('Error during upload: ' + error);
      //   } else {
      //     alert('File "' + fileObj.name + '" successfully uploaded');
      //   }
      //   instance.currentUpload.set(false);
      // });
      //
      // upload.start();
    }
  }
});
