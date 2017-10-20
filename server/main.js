import { Meteor } from 'meteor/meteor';
import '/imports/startup/server/accounts.js';

import '/imports/api/notifications.js';
import '/imports/api/notificationsMethods.js';
import '/imports/api/workshops.js';
import '/imports/api/workshopsMethods.js';
import '/imports/api/messagesMethods.js';

// Conexión con Mandrill (API de Mailchimp) para enviar correos
process.env.MAIL_URL = "smtp://info@meetin.com.co:Flxl60kbhCe60lCmQXLTig@smtp.mandrillapp.com:587/";
