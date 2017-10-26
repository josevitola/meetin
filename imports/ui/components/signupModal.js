import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { validateEmail } from '/imports/lib/stylish.js';

import './loginModal.js';
import './signupModal.html';

Template.signupModal.onCreated(function signupModalOnCreated() {
  Session.set('notName', false);
  Session.set('notMail', false);
  Session.set('notPass', false);
  Session.set('notConf', false);
  Session.set('mailValid', true);
})

Template.signupModal.onRendered(function signupModalOnRendered() {
  $("#signupModal").modal({
    onApprove: function() {
      // TODO security on forms
      const name = $('input[name=signup-name]').val();
      const mail = $('input[name=signup-email]').val();
      const pass = $('input[name=signup-pass]').val();
      // const conf = $('input[name=signup-conf]').val();
      const valid = validateEmail(mail);

      Session.set('notName', !mail);
      Session.set('notMail', !mail);
      Session.set('notPass', !pass);
      // Session.set('notConf', !pass);
      Session.set('mailValid', valid);

      const phone = 0;
      const desc = "Edita este campo para hacer una descripción en tu perfil";
      const attendsTo = [];
      const owns = [];
      const notifications = [];

      const user = {
        email: mail,
        password: pass,
        profile: {
          name: name,
          phone: phone,
          desc: desc,
          attendsTo: attendsTo,
          owns: owns,
          notifications: notifications
        }
      }

      Meteor.call('users.insert', user, (error, result) => {
        if(!error) {
          Meteor.loginWithPassword(mail, pass, () => {
            FlowRouter.go('/');
          });
        } else {
          alert(error.message);
        }
      });
    }
  });
});

Template.signupModal.helpers({
  notName() {
    return Session.get('notName');
  },
  notMail() {
    return Session.get('notMail');
  },
  notPass() {
    return Session.get('notPass');
  },
  notConf() {
    return Session.get('notConfs');
  },
  mailValid() {
    return Session.get('mailValid');
  }
});
