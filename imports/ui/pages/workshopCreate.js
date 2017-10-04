import {Template} from 'meteor/templating';
import {Workshops} from '/imports/api/workshops.js';
import './workshopCreate.html';

Template.workshopCreate.events({
  'click .ui.create.workshop.button' () {
    console.log("creating");
    const name = $('input[name=work-name]').val();
    const addr = $('input[name=work-addr]').val();
    const desc = $('textarea[name=work-desc]').val();
    console.log(desc);
    // TODO security on field - stop creation if price is NaN
    const price = parseInt($('input[name=work-price]').val());

    const workshop = {
      name: name,
      addr: addr,
      desc: desc,
      price: price,
      owner: Meteor.userId()
    }

    Meteor.call('workshops.insert', workshop, (error, result) => {
      let workshopUrl = "/workshops/" + result;
      FlowRouter.go(workshopUrl);
    });
  }
});
