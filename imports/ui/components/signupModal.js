import { Template } from 'meteor/templating';

import './signupModal.html';

Template.signupModal.onRendered(function signupModalOnRendered() {
    $("#signupModal").modal({
      onDeny: function(){
        console.log('canceled')
        return false;
      },
      onApprove: function() {
        // TODO security on forms
        console.log("lala");
        const name = $('input[name=signup-name]').val();
        const mail = $('input[name=signup-email]').val();
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
    });
  }
);
