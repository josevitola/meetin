import { Template } from 'meteor/templating';

import '../components/loginModal.js';
import '../components/userNavbar.js';
import './navbar.html';

Template.navbar.helpers({
  profile() {
    return Meteor.user() || Meteor.loggingIn() ? "user" : "guest";
  }
});

Template.navbar.events({
  'click .ui.login.button'() {
    $("#loginModal").modal('show');
  },
});

// $(function () {
//   $(document).scroll(function () {
//     var $nav = $("#navbar");
//     var $name = $("#logo");
//     $nav.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
//     $name.toggleClass('inverted', $(this).scrollTop() < $nav.height());
//   });
// });
