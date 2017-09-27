import '/imports/ui/layouts/navbar.js';

import '/imports/ui/pages/home.js';
import '/imports/ui/pages/user.js';
import '/imports/ui/pages/workshop.js';

// BlazeLayout.setRoot('body');

FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render('applicationLayout', { top: 'navbar', main: 'home', footer: 'footer' })
  },
  name: 'home'
});

FlowRouter.route('/workshops/:_id', {
  action: function( params, queryParams ) {
    BlazeLayout.render('applicationLayout', { top: 'navbar', main: 'workshop' })
  },
  name: 'workshop'
});

FlowRouter.route('/users/:_id', {
  action: function( params, queryParams ) {
    BlazeLayout.render('applicationLayout', { top: 'navbar', main: 'user' })
  },
  name: 'user'
});
