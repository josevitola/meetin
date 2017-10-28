import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Email } from 'meteor/email';

Meteor.methods({
  sendMessage(message) {
    check(message, Object);

    Meteor.defer(() => {
      SSR.compileTemplate('htmlEmail', Assets.getText('attend.html'));
      Email.send({
        to: `${message.attendantName} ${message.attendantEmail}`,
        from: 'info@meetin.com.co Meet In',
        subject: `Disfruta la actividad - Meet In`,
        html: SSR.render('htmlEmail', message)
      });
    });
  },
});
