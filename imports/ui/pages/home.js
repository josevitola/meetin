import { Template } from 'meteor/templating';

import '../components/workCreateModal.js';
import './home.html';

Template.home.events({
  'submit .ui.signup.form'(e) {
    e.preventDefault();
    const target = e.currentTarget;
    const name = target[0].value;
    const mail = target[1].value;
    const pass = target[2].value;
    const conf = target[3].value;

    const user = {
      email: mail,
      password: pass,
      profile: {
        name: name,
      }
    }

    Meteor.call('users.insert', user);
  },

  'submit .ui.login.form'(e) {
    e.preventDefault();
    const target = e.currentTarget;
    const mail = target[0].value;
    const pass = target[1].value;

    Meteor.loginWithPassword(mail, pass);
  }
});
