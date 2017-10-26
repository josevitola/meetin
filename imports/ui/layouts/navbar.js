import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import '../components/accountsModal.js';
import '../components/loginModal.js';
import '../components/signupModal.js';
import '../components/userNavbar.js';
import './navbar.html';

Template.navbar.helpers({
  profile() {
    return Meteor.user() || Meteor.loggingIn() ? "user" : "guest";
  }
});

Template.navbar.events({
  'click .ui.login.button'() {
    Session.set('accountsModal', 'login');
    $("#accountsModal").modal('show');
  },
});

Template.homeNavbar.events({
  'click .ui.login.button'() {
    Session.set('accountsModal', 'login');
    $("#accountsModal").modal('show');
  },
  'click .ui.signup.button'() {
    Session.set('accountsModal', 'signup');
    $("#accountsModal").modal('show');
  },
});

$(function () {
  $(document).scroll(function () {
    var $nav = $("#homeNavbar");
    $nav.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
  });
});
