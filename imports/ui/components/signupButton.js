import { Template } from 'meteor/templating';

import './signupButton.html';

Template.signupButton.events({
  'click .ui.signup.button'() {
    $('#signupModalView').modal({
      onDeny: function(){
        console.log('canceled')
        return false;
      },
      onApprove: function() {
        // TODO security on forms
        const name = $('input[name=signup-name]').val();
        const mail = $('input[name=signup-mail]').val();
        const pass = $('input[name=signup-pass]').val();
        const conf = $('input[name=signup-conf]').val();

        const user = {
          email: mail,
          password: pass,
          profile: {
            name: name,
          }
        }

        Meteor.call('users.insert', user);
      }
    }).modal('show');
  }
});
