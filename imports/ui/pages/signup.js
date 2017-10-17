import { Template } from 'meteor/templating';

import './signup.html';

Template.signup.onRendered(function() {
  document.title = 'Registro | Meetin';
})

Template.signup.events({
  'keypress input'(event) {
    if(event.keyCode == 13) { // if enter key pressed
      $('.ui.signup.button').click();
    }
  },
  'click .ui.signup.button'() {
    const name = $('input[name=signup-name]').val();
    const mail = $('input[name=signup-email]').val();
    const desc = $('textarea[name=signup-desc]').val();
    const phone = parseInt($('input[name=signup-phone]').val());
    const pass = $('input[name=signup-pass]').val();
    const conf = $('input[name=signup-conf]').val();

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
