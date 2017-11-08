import { Meteor } from 'meteor/meteor';
import { Files } from '/imports/lib/core.js';
import { FilesCollection } from 'meteor/ostrio:files';

var Dropbox, Request, bound, client, fs;

Dropbox = require('dropbox');
Request = Npm.require('request');
fs = Npm.require('fs');
bound = Meteor.bindEnvironment(function(callback) {
  return callback();
});

var dbx = new Dropbox({ accessToken: "M2IBUck_S1AAAAAAAAAAqzAh6oexM8Dt6otd8_pqJjVVQZ6aCuE7jcBsAkpn6t7B" });

Files.Images = new FilesCollection({
  // debug: true,
  storagePath: 'assets/uploads/images',
  collectionName: 'images',
  allowClientCode: true,
  // disableUpload: true,
  // disableDownload: true,
  protected(fileObj) {
    if (fileObj) {
      if (!(fileObj.meta && fileObj.meta.secured)) {
        return true;
      } else if ((fileObj.meta && fileObj.meta.secured === true) && this.userId === fileObj.userId) {
        return true;
      }
    }
    return false;
  },
  onBeforeRemove(cursor) {
    const res = cursor.map((file) => {
      if (file && file.userId && _.isString(file.userId)) {
        return file.userId === this.userId;
      }
      return false;
    });
    return !~res.indexOf(false);
  },
  onBeforeUpload(file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    } else {
      return 'Por favor sube una imagen con tamaño menor o igual a 10MB';
    }
  },
  onAfterUpload(fileRef){
    console.log("Uploading file: " + fileRef.name);
    var self = this;
    fs.readFile(fileRef.path, Meteor.bindEnvironment(function(error, data) {
      if(error){
        console.error("error reading file ", error);
      }else{
        return dbx.filesUpload({path: '/' + fileRef.path , contents: data})
          .then(function(response) {
            console.log(response);
          })
          .catch(function(error) {
            console.log("error uploading file");
            console.error(error);
          });
      }
    }))
  }
});

Meteor.publish('files.images.all', function () {
  return Files.Images.find().cursor;
});
