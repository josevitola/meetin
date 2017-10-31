import { Promise } from 'meteor/promise';

const Dropbox = require('dropbox');
const dbx = new Dropbox({ accessToken: "M2IBUck_S1AAAAAAAAAAqzAh6oexM8Dt6otd8_pqJjVVQZ6aCuE7jcBsAkpn6t7B" });

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fileUpload(path, contents,){
  return dbx.filesUpload({path: path , contents: contents, mode: 'overwrite'})
    .then(function(response) {
      return dbx.sharingCreateSharedLink({path:path});
    },function(error) {
      console.error("At imports/api/server/dropbox.js row:9", error);
      return error;
    })
}

function getImageUrl(path, tries = 5, time = 500){
  return dbx.filesDownload({path: path})
    .then(function (response) {
      return response.fileBinary
    },function (error) {
      console.error(error);
      if (tries == 0) {
        return null;
      }else {
        Promise.await(sleep(timep));
         return getImageUrl(path, tries-1)
      }
    })
}

function filesGetThumbnail(path, tries = 5, time = 500 ){
  return dbx.filesGetThumbnail({path:path, size:'w640h480'})
    .then(function (response) {
        return response.fileBinary
    },function (error) {
      console.error(error);
      if (tries == 0) {
        return null;
      }else {
        Promise.await(sleep(timep));
        return filesGetThumbnail(path, tries-1)
      }
    })
}






export { fileUpload, getImageUrl, filesGetThumbnail};
