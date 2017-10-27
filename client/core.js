import { Session } from 'meteor/session';
import { Files } from '/imports/lib/core.js';

import '/imports/api/client/files.js';

import '/imports/ui/layouts/navbar.js';
import '/imports/startup/client/routes.js';

Session.set('accountsModal', 'login');

export { Files };
