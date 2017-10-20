import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Email } from 'meteor/email';

Meteor.methods({
  sendMessage(message) {
    check(message, Object);

    Meteor.defer(() => {
      SSR.compileTemplate('htmlEmail', Assets.getText('newAttendant.html'));
      Email.send({
        to: `${message.owner} ${message.email}`,
        from: 'info@meetin.com.co',
        subject: `Hola ${message.owner}!`,
        html: SSR.render('htmlEmail', message)
      });
    });
  },
});
