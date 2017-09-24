import { Template } from 'meteor/templating';

import { Workshops } from '/imports/api/workshops.js';
import './workCreateModal.html';

Template.workCreateButton.events({
  'click .ui.create.workshop.button'() {
    $('#modalView').modal({
      onDeny: function(){
        console.log('canceled')
        return false;
      },
      onApprove: function() {
        const name = $('input[name=work-name]').val();
        const addr = $('input[name=work-addr]').val();
        // TODO security on field - stop creation if price is NaN
        const price = parseInt($('input[name=work-price]').val());

        const workshop = {
          name: name,
          addr: addr,
          price: price,
          owner: Meteor.userId()
        }

        Meteor.call('workshops.insert', workshop);
      }
    }).modal('show');
  }
});
