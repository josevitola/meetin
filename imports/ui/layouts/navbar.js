import { Template } from 'meteor/templating';

import '../components/loginModal.js';
import '../components/signupModal.js';
import '../components/userNavbar.js';
import './navbar.html';

Template.navbar.helpers({
  profile() {
    return Meteor.user() || Meteor.loggingIn() ? "user" : "guest";
  }
});

// Template.navbar.events({
//   'click .ui.login.button'() {
//     $("#loginModal").modal('show');
//   },
// });

Template.homeNavbar.events({
  'click .ui.login.button'() {
    $("#loginModal").modal('show');
  },
  'click .ui.signup.button'() {
    $("#signupModal").modal('show');
  },
});

$(function () {
  $(document).scroll(function () {
    var $nav = $("#homeNavbar");
    $nav.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
  });
});
