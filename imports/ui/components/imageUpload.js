import { Template } from 'meteor/templating';
import { Images } from '/imports/api/files.js';

import './imageUpload.html';

Template.imageUpload.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
});

Template.imageUpload.helpers({
  currentUpload() {
    return Template.instance().currentUpload.get();
  },
  labelName() {
    const files = $('#workImage').files;
    console.log(files);
    if(files && files.length > 0) {
      return files.length + ' archivos seleccionados';
    } else {
      return 'Escoger un archivo';
    }
  }
});

Template.imageUpload.events({
  'change #workImage'(e, template) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case
      // multiple files were selected

      // const upload = Images.insert({
      //   file: e.currentTarget.files[0],
      //   streams: 'dynamic',
      //   chunkSize: 'dynamic'
      // }, false);
      //
      // upload.on('start', function () {
      //   template.currentUpload.set(this);
      // });
      //
      // upload.on('end', function (error, fileObj) {
      //   if (error) {
      //     alert('Error during upload: ' + error);
      //   } else {
      //     alert('File "' + fileObj.name + '" successfully uploaded');
      //   }
      //   template.currentUpload.set(false);
      // });
      //
      // upload.start();
    }
  }
});
