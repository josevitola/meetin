import '/imports/ui/pages/home.js';
import '/imports/ui/pages/workshop.js';

FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render('applicationLayout', { main: 'home' })
  },
  name: 'home'
});

FlowRouter.route('/workshops/:_id', {
  action: function( params, queryParams ) {
    BlazeLayout.render('applicationLayout', { main: 'workshop' })
  },
  name: 'workshop'
});
