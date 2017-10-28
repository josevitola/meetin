import { FilesCollection } from 'meteor/ostrio:files';
import { Files } from '/imports/lib/core.js';

Files.Images = new FilesCollection({
  // debug: true,
  collectionName: 'images',
  allowClientCode: true, // Disallow remove files from Client
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
  onBeforeUpload(file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    } else {
      return 'Por favor sube una imagen con tamaño menor o igual a 10MB';
    }
  },
});
