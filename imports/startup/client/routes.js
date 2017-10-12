import '/imports/ui/layouts/navbar.js';
import '/imports/ui/layouts/footer.html';

import '/imports/ui/pages/home.js';
import '/imports/ui/pages/signup.js';
import '/imports/ui/pages/user.js';
import '/imports/ui/pages/workshop.js';
import '/imports/ui/pages/workshopCreate.js';

// BlazeLayout.setRoot('body');

FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render('applicationLayout', { top: 'homeNavbar', main: 'home' })
  },
  name: 'home'
});

FlowRouter.route('/signup', {
  action: function( params, queryParams ) {
    BlazeLayout.render('applicationLayout', { main: 'signup' })
  },
  name: 'user'
});

FlowRouter.route('/workshops/create', {
  action: function( params, queryParams ) {
    BlazeLayout.render('applicationLayout', { top: 'navbar', main: 'workshopCreate', footer: 'footer' })
  },
  name: 'workshop'
});

FlowRouter.route('/workshops/:_id', {
  action: function( params, queryParams ) {
    BlazeLayout.render('applicationLayout', { top: 'navbar', main: 'workshop', footer: 'footer' })
  },
  name: 'workshop'
});

FlowRouter.route('/users/:_id', {
  action: function( params, queryParams ) {
    BlazeLayout.render('applicationLayout', { top: 'navbar', main: 'user', footer: 'footer' })
  },
  name: 'user'
});
