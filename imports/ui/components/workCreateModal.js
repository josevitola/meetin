import { Template } from 'meteor/templating';

import { Workshops } from '/imports/api/workshops.js';
import './workCreateModal.html';

Template.workCreateButton.events({
  'click .ui.create.workshop.button'() {
    console.log("click");
    $('#modalView').modal({
      onDeny: function(){
        console.log('canceled')
        return false;
      },
      onApprove: function() {
        console.log('approved');
        console.log("approved");
        const name = $('input[name=work-name]').val();
        const addr = $('input[name=work-addr]').val();
        const price = $('input[name=work-price]').val();

        const workshop = {
          name: name,
          addr: addr,
          price: price
        }

        Meteor.call('workshops.insert', workshop);
      }
    }).modal('show');
  }
});
