import { Template } from 'meteor/templating';

import './loginButton.html';

Template.loginButton.events({
  'click .ui.login.button'() {
    $('#loginModalView').modal({
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
    }).modal('show');
  }
});
