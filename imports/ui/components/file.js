import { Template } from 'meteor/templating';
import { Files } from '/imports/lib/core.js';

import './file.html';

Template.file.helpers({
  imageFile() {
    return Files.Images.findOne();
  },
});
