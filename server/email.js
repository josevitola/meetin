import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Match } from 'meteor/check';
import { Email } from 'meteor/email';

import { WorkshopSchema } from '/imports/api/schemas.js';
Meteor.methods({
  'email.notifyAttendant'(message) {
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

  'email.toWorkshopOrganizer'(workshop, message) {
    console.log(message);
    check(workshop._id, String);
    check(workshop.name, String);
    check(workshop.owner, String);
    check(message, String);

    // Let other method calls from the same client start running, without
    // waiting for the email sending to complete.
    this.unblock();

    const organizer = Meteor.users.findOne(workshop.owner);
    if(!organizer) {
      throw new Meteor.Error(404, 'Organizer not found');
    }

    const sender = Meteor.users.findOne(this.userId);
    if(!sender) {
      throw new Meteor.Error(404, 'User not found');
    }

    const to = organizer.emails[0].address;
    const from = 'info@meetin.com.co Meet In';
    console.log(to, from);
    const subject = sender.profile.name + " tiene una pregunta para ti sobre tu evento " + workshop.name;

    Meteor.defer(() => {
      SSR.compileTemplate('questionHtmlEmail', Assets.getText('question.html'));
      Email.send({
        to: to,
        from: from,
        subject: subject,
        html: SSR.render('questionHtmlEmail', {
          organizer: organizer,
          participant: sender,
          message: message,
          workshop: workshop,
          participantEmail: sender.emails[0].address,
        })
      });
    });
  }
});
