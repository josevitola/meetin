import '/imports/ui/pages/home.js';
import '/imports/ui/pages/workshop.js';

FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render('applicationLayout', { main: 'home' })
  },
  name: 'home'
});

FlowRouter.route('/workshop', {
  action: function() {
    BlazeLayout.render('applicationLayout', { main: 'workshop' })
  },
  name: 'home'
});
