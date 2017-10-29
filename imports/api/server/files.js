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

/*client2 = new Dropbox.Client({
  key: 'hknteuv24yzbjq2',
  secret: 'wnt7ebl7egstkv7',
  token: 'IeUrRPCx4UAAAAAAAAAAleZyHgAgesSWEjIrHiHGlgLEFNWICq0AEygw8aRumV3V'
});

var client = new Dropbox.Client({
  key: 'tovkj5hv1hwzwzu',
  secret: 'liotaeqx4ff6rln',
  token: 'M2IBUck_S1AAAAAAAAAAqzAh6oexM8Dt6otd8_pqJjVVQZ6aCuE7jcBsAkpn6t7B'
});*/

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
    console.log("hola Archivo");
    console.log(fileRef);
    var self = this;
    fs.readFile(fileRef.path, Meteor.bindEnvironment(function(error, data) {
      if(error){
        console.error(error);
      }else{
        return dbx.filesUpload({path: '/' + fileRef.path , contents: data})
          .then(function(response) {
            console.log(response);
          })
          .catch(function(error) {
            console.log("error");
            console.error(error);
          });
      }
      //self.unlink(self.collection.findOne(fileRef._id));
      //self.collection.remove(fileRef._id)
    }))
  }
});
/*
Files.Images = new FilesCollection({
  // debug: true,
  storagePath: 'assets/app/uploads/images',
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
});

Files.Images.denyClient();
Files.Images.on('afterUpload', function(_fileRef) {
  const makeUrl = (stat, fileRef, version, triesUrl = 0) => {
    client.makeUrl(stat.path, {
      long: true,
      downloadHack: true
    }, (error, xml) => {
      bound(() => {
        // Store downloadable link in file's meta object
        if (error) {
          if (triesUrl < 10) {
            Meteor.setTimeout(() => {
              makeUrl(stat, fileRef, version, ++triesUrl);
            }, 2048);
          } else {
            console.error(error, {
              triesUrl: triesUrl
            });
          }
        } else if (xml) {
          const upd = { $set: {} };
          upd['$set']['versions.' + version + '.meta.pipeFrom'] = xml.url;
          upd['$set']['versions.' + version + '.meta.pipePath'] = stat.path;
          this.collection.update({
            _id: fileRef._id
          }, upd, (updError) => {
            if (updError) {
              console.error(updError);
            } else {
              // Unlink original files from FS
              // after successful upload to DropBox
              this.unlink(this.collection.findOne(fileRef._id), version);
            }
          });
        } else {
          if (triesUrl < 10) {
            Meteor.setTimeout(() => {
              // Generate downloadable link
              makeUrl(stat, fileRef, version, ++triesUrl);
            }, 2048);
          } else {
            console.error("client.makeUrl doesn't returns xml", {
              triesUrl: triesUrl
            });
          }
        }
      });
    });
  };

  const writeToDB = (fileRef, version, data, triesSend = 0) => {
    // DropBox already uses random URLs
    // No need to use random file names
    client.writeFile(fileRef._id + '-' + version + '.' + fileRef.extension, data, (error, stat) => {
      bound(() => {
        if (error) {
          if (triesSend < 10) {
            Meteor.setTimeout(() => {
              // Write file to DropBox
              writeToDB(fileRef, version, data, ++triesSend);
            }, 2048);
          } else {
            console.error(error, {
              triesSend: triesSend
            });
          }
        } else {
          makeUrl(stat, fileRef, version);
        }
      });
    });
  };

  const readFile = (fileRef, vRef, version, triesRead = 0) => {
    fs.readFile(vRef.path, (error, data) => {
      bound(() => {
        if (error) {
          if (triesRead < 10) {
            readFile(fileRef, vRef, version, ++triesRead);
          } else {
            console.error(error);
          }
        } else {
          writeToDB(fileRef, version, data);
        }
      });
    });
  };

  sendToStorage = (fileRef) => {
    _.each(fileRef.versions, (vRef, version) => {
      readFile(fileRef, vRef, version);
    });
  };
})

const _origRemove = Files.Images.remove;
Files.Images.remove = function(search) {
  const cursor = this.collection.find(search);
  cursor.forEach((fileRef) => {
    _.each(fileRef.versions, (vRef) => {
      if (vRef && vRef.meta && vRef.meta.pipePath != null) {
        if (useDropBox) {
          // DropBox usage:
          client.remove(vRef.meta.pipePath, (error) => {
            bound(() => {
              if (error) {
                console.error(error);
              }
            });
          });
        } else {
          // AWS:S3 usage:
          client.deleteObject({
            Bucket: s3Conf.bucket,
            Key: vRef.meta.pipePath,
          }, (error) => {
            bound(() => {
              if (error) {
                console.error(error);
              }
            });
          });
        }
      }
    });
  });
  // Call original method
  _origRemove.call(this, search);
};
*/
Meteor.publish('files.images.all', function () {
  return Files.Images.find().cursor;
});
