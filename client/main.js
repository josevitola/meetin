import { Session } from 'meteor/session';
import '/imports/ui/layouts/navbar.js';
import '/imports/startup/client/routes.js';

Session.set('accountsModal', 'login');
