import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Workshops } from '/imports/api/workshops.js';

import './searchBar.html';

var altContent = [];

Template.searchBar.onRendered(function searchBarOnRendered() {
  $('.ui.search').search({
    source : Workshops.find({}).fetch(),
    fields: {
      title: 'name',
      description: 'addr'
    },
    searchFields   : [
      'name', 'tags'
    ],
    searchFullText: false,
    onSelect: function(result, response) {
      FlowRouter.go('/workshops/' + result._id);
    }
  });
});

Template.searchBar.events({
  'keypress .ui.search'(event, instance) {
    const currentTarget = event.currentTarget;
    // enter --> route to search results page
    if(event.keyCode == 13) {
      const search = $(currentTarget).find('input').val();
      // FlowRouter.go('/search?q=' + search);
    }
  }
})
