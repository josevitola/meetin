import { Template } from 'meteor/templating';

import './notifications.html';

Template.notifications.onRendered(function notificationsOnRendered() {
  document.title = 'Tus notificaciones | Meetin';
})
