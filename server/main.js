import '/imports/startup/server/accounts.js';
import '/imports/startup/server/email.js';

import './email.js';

import '/imports/api/comments.js';
import '/imports/api/notifications.js';
import '/imports/api/workshops.js';

import '/imports/api/server/comments.js';
import '/imports/api/server/files.js';
import '/imports/api/server/users.js';
import '/imports/api/server/notifications.js';
import '/imports/api/server/workshops.js';

const user = "info@meetin.com.co";
const pass = "Flxl60kbhCe60lCmQXLTig";
const host = "smtp.mandrillapp.com";
const port = 587;
const url = "smtp://" + user + ":" + pass + "@" + host + ":" + port;

process.env.MAIL_URL = url;

// TODO security. There's got to be a better way to do this
ServiceConfiguration.configurations.upsert(
  { service: 'facebook' },
  {
    $set: {
      loginStyle: 'popup',
      appId: '142750623026905',
      secret: 'f9114b80e874995081bce938b8c503b3'
    }
  }
);