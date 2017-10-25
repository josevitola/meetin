import { Meteor } from 'meteor/meteor';
import '/imports/startup/server/accounts.js';

import './email.js';
import './methods/notifications.js';
import './methods/workshops.js';
import '/imports/api/files.js';
import '/imports/api/notifications.js';
import '/imports/api/workshops.js';

// Conexión con Mandrill (API de Mailchimp) para enviar correos
process.env.MAIL_URL = "smtp://info@meetin.com.co:Flxl60kbhCe60lCmQXLTig@smtp.mandrillapp.com:587/";
