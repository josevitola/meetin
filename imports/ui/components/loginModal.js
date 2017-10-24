import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { validateEmail } from '/imports/lib/stylish.js';

import './loginModal.html';

Template.loginModalContent.onCreated(function loginModalOnCreated() {
  Session.set('notMail', false);
  Session.set('notPass', false);
  Session.set('mailValid', true);
});

Template.loginModal.onRendered(function loginModalOnRendered() {
  $("#loginModal").modal({
    onApprove: function() {
      // TODO security on forms
      const mail = $('input[name=login-email]').val();
      const pass = $('input[name=login-pass]').val();
      const valid = validateEmail(mail);

      Session.set('notMail', !mail);
      Session.set('notPass', !pass);
      Session.set('mailValid', valid);

      if(mail && pass && valid) {
        Meteor.loginWithPassword(mail, pass, (error) => {
          if(error) {
            const code = error.error;
            if(code == 403) {
              $('.ui.error.message').removeClass('hidden');
            }
          } else {
            $("#loginModal").modal('hide');
            return true;
          }
        });
      }
      return false;
    }
  });
});

Template.loginModalContent.helpers({
  notMail() {
    return Session.get('notMail');
  },
  notPass() {
    return Session.get('notPass');
  },
  mailValid() {
    return Session.get('mailValid');
  }
});

Template.loginModalContent.events({
  'keypress input'(e, instance) {
    if(e.keyCode === 13) {  // if enter
      $('.ui.login.button.ok').click();
    }
  }
})
