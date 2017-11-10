import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { validateEmail } from '/imports/lib/stylish.js';

import './accountsModal.html';

Template.accountsModal.helpers({
  isLogin(type) {
    return Session.get('accountsModal') === "login";
  },
  isSignup(type) {
    return Session.get('accountsModal') === "signup";
  }
});

Template.accountsModal.onDestroyed(function() {
  $('#accountsModal').modal('hide');
})

Template.message.events({
  'click a.toggle.modal'() {
    Session.set('accountsModal', Session.get('accountsModal') === 'login' ? 'signup' : 'login');
  }
});

Template.loginContent.onCreated(function loginModalOnCreated() {
  Session.set('notMail', false);
  Session.set('notPass', false);
  Session.set('mailValid', true);
});

Template.loginContent.onRendered(function() {
  $("#accountsModal").modal({
    onApprove: function() {
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
})

Template.loginContent.helpers({
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

Template.loginContent.events({
  'keypress input'(event, instance) {
    if(event.keyCode === 13) {  // if enter
      $('.ui.login.button.ok').click();
    }
  },

  'click .ui.facebook.button'(event, instance) {
    event.preventDefault();
    
    Meteor.loginWithFacebook(
      {requestPermissions: ['public_profile', 'email']}, 
      function(err) {
        if (err) {
          console.log('Handle errors here: ', err);
        }
      }
    );
  }
});

Template.signupContent.onCreated(function signupModalOnCreated() {
  Session.set('notName', false);
  Session.set('notMail', false);
  Session.set('notPass', false);
  // Session.set('notConf', false);
  Session.set('mailValid', true);
});

Template.signupContent.onRendered(function() {
  $("#accountsModal").modal({
    onApprove: function() {
      const name = $('input[name=signup-name]').val();
      const mail = $('input[name=signup-email]').val();
      const pass = $('input[name=signup-pass]').val();
      // const conf = $('input[name=signup-conf]').val();
      const valid = validateEmail(mail);

      Session.set('notName', !name);
      Session.set('notMail', !mail);
      Session.set('notPass', !pass);
      // Session.set('notConf', !pass);
      Session.set('mailValid', valid);

      if(name && mail && pass && valid) {
        Meteor.call('users.insert', name, mail, pass, (error, result) => {
          if(!error) {
            Meteor.loginWithPassword(mail, pass, () => {
              FlowRouter.go('/');
            });
          } else {
            alert(error.message);
          }
        });
      }
    }
  });
});

Template.signupContent.helpers({
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


Template.signupContent.events({
  'keypress input'(e, instance) {
    if(e.keyCode === 13) {  // if enter
      $('.ui.login.button.ok').click();
    }
  }
});
