import { Template } from 'meteor/templating';

import '../components/loginModal.js';
import '../components/signupModal.js';
import '../components/userNavbarItems.js';
import './navbar.html';

Template.navbar.events({
  'click .ui.login.button'() {
    $("#loginModal").modal('show');
  },

  'click .ui.signup.button'() {
    $("#signupModal").modal('show');
  }
});

$(function () {
  $(document).scroll(function () {
    var $nav = $("#navbar");
    var $name = $("#logo");
    $nav.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
    $name.toggleClass('inverted', $(this).scrollTop() < $nav.height());
  });
});
