import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Match } from 'meteor/check';
import { Email } from 'meteor/email';

import { WorkshopSchema } from '/imports/api/schemas.js';

function applyTextTemplate(userId, steps) {
  var username;
  if(userId == null) username = "usuario";
  else username = Meteor.users.find({_id: userId}).fetch().profile.name;
  var message = "¡Hola, " + username +
    "! Recientemente usaste el servicio de Puerta Bogotá " +
    "y creaste un itinerario para tu día de turista. Te lo enviamos de forma " +
    "simplificada aquí: \n\n";

  for(let i = 0; i < steps.length; i++) {
    message += steps[i].name;
    message += "\n";
  }

  message += "\n";
  message += "El total de este presupuesto fue de " + getPriceFromSteps(steps) + ".\n";
  message += "Para más funcionalidades, poder guardar tus itinerarios y compartirlos " +
    "regístrate en Puerta Bogotá.\n¡Gracias por usar nuestra aplicación!"

  return message;
}

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

  'email.toWorkshopOrganizer'(workshop, message) {
    console.log(
      process.env.MAIL_URL
    );
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
    const from = sender.emails[0].address;
    console.log(to, from);
    const subject = sender.profile.name + " tiene una pregunta para ti sobre tu evento " + workshop.name;

    Meteor.defer(() => {
      Email.send({
        to,
        from,
        subject,
        message
      });
    });
  }
});
