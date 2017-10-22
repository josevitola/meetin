import { Template } from 'meteor/templating';
import { Images } from '/imports/api/files.js';

import './file.html';

Template.file.helpers({
  imageFile() {
    return Images.findOne();
  },
});
