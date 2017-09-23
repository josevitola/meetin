import '/imports/ui/pages/home.js';

FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render('applicationLayout', { main: 'home' })
  },
  name: 'home'
}); 
