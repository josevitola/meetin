import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import '../components/accountsModal.js';
import '../components/userNavbar.js';
import './navbar.html';

Template.navbar.onCreated(function() {
  this.test = () => FlowRouter.current();

  this.autorun(() => {
    console.log(this.test());
  });
})

Template.navbar.helpers({
  profile() {
    return Meteor.user() || Meteor.loggingIn() ? "user" : "guest";
  },

  isHome() {
    if(FlowRouter.current().path === "/") {
      return 'home';
    }
  }
});

Template.navbar.events({
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
    var $nav = $("#navbar.home");
    $nav.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
  });
});
