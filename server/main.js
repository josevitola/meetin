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
