import { Template } from 'meteor/templating';

import '../components/workCreateModal.js';
import '../components/workshopCard.js';

import '../layouts/generalDashboard.js';
import '../layouts/userDashboard.js';

import './home.html';

Template.home.events({
  'click .ui.signup.button'() {
    $("#signupModal").modal('show');
  }
})
