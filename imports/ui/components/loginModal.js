import { Template } from 'meteor/templating';

import './loginModal.html';

Template.loginModal.onRendered(function loginModalOnRendered() {
  $("#loginModal").modal({
    onDeny: function(){
      console.log('canceled')
      return false;
    },
    onApprove: function() {
      // TODO security on forms
      const mail = $('input[name=login-email]').val();
      const pass = $('input[name=login-pass]').val();
      Meteor.loginWithPassword(mail, pass);
    }
  });
});
