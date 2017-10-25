import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Workshops } from '/imports/api/workshops.js';
import { Images } from '/imports/api/files.js';

import '../components/imageUpload.js';
import './workshopCreate.html';

Template.workshopCreate.onCreated(function workCreateOnCreated() {
  this.items = new ReactiveVar([]);
  this.tags = new ReactiveVar([]);
  this.currentUpload = new ReactiveVar(false);
});

Template.workshopCreate.helpers({
  items() {
    return Template.instance().items.get();
  },
  tags() {
    return Template.instance().tags.get();
  }
});

Template.workshopCreate.onRendered(function workCreateOnRendered() {
  $('#initDate').calendar({
    type: 'date',
    minDate: new Date(Date.now()),
    onChange: function (date, text, mode) {
      let now = new Date(Date.now());
      if(date.getMonth() != now.getMonth() || date.getDay() != now.getDay()) {
        // console.log(Date.now());
        // console.log(date.getTime());
        date.setHours(0,0,0,0);
      }
      $('#initTime').calendar({
        type: 'time',
        minDate: date,
        onChange: function (date, text, mode) {
          $('#endTime').calendar({
            type: 'time',
            minDate: date,
            disableMinute: true
          });
        },
        disableMinute: true
      });
    },
    text: {
      days: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
      months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    }
  });

  $('#initTime').calendar({
    type: 'time',
    minDate: new Date(Date.now()),
    onChange: function (date, text, mode) {
      $('#endTime').calendar({
        type: 'time',
        minDate: date,
        disableMinute: true
      });
    },
    disableMinute: true
  });

  $('#endTime').calendar({
    type: 'time',
    minDate: new Date(Date.now()),
    disableMinute: true
  });
})

Template.workshopCreate.events({
  'change #initDate' (event) {
    $('#initTime').calendar({
      type: 'time',
      minDate: new Date($('#initDate').calendar("get date")),
      disableMinute: true
    });
  },

  'change #initTime' (event) {
    $('#endTime').calendar({
      type: 'time',
      minDate: new Date($('#initTime').calendar("get date")),
      disableMinute: true
    });
  },

  'click .ui.create.workshop.button' (event, instance) {
    // TODO security on field - stop creation if price is NaN
    const name = $('input[name=work-name]').val();
    const addr = $('input[name=work-addr]').val();
    const desc = $('textarea[name=work-desc]').val();
    const price = parseInt($('input[name=work-price]').val());
    const initDate =  $('#initDate').calendar("get date");
    // const endDate =  $('#endDate').calendar("get date");
    const initTime =  $('#initTime').calendar("get date");
    const endTime =  $('#endTime').calendar("get date");
    const tags = instance.tags.get();
    const items = instance.items.get();
    const pics = '';
    const participants = [];

    const workshop = {
      name: name,
      addr: addr,
      photo: '',
      desc: desc,
      price: price,
      initDate: initDate,
      // endDate: endDate,
      initTime: initTime,
      endTime: endTime,
      tags: tags,
      items: items,
      owner: Meteor.userId(),
      participants: participants
    }

    Meteor.call('workshops.insert', workshop, (error, workId) => {
      // TODO display error to user properly
      if(error) {
        alert(error.message);
      } else {
        // upload Images
        let images = $('#imageInput')[0].files;
        if(images && images[0]) {
          const upload = Images.insert({
            file: images[0],
            streams: 'dynamic',
            chunkSize: 'dynamic'
          }, false);

          upload.on('start', function () {
            instance.currentUpload.set(this);
          });

          upload.on('end', function (error, fileObj) {
            if (error) {
              alert('Error during upload: ' + error);
            } else {
              // console.log('File "' + fileObj.name + '" successfully uploaded');
              // console.log(fileObj._id);
              Meteor.call('workshops.addPic', workId, fileObj._id);
            }
            instance.currentUpload.set(false);
          });

          upload.start();
        }

        // Finally go to newly created workshop
        let workshopUrl = "/workshops/" + workId;
        FlowRouter.go(workshopUrl);
      }
    });
  },

  'click .ui.add.tag.button'(event, instance) {
    const tag = $('input[name=work-tags]').val();
    if(tag.trim().length !== 0) {
      const instanceTags = instance.tags.get();
      instanceTags.push(tag);
      instance.tags.set(instanceTags);
    }

    $('input[name=work-tags]').val('');
    $('input[name=work-tags]').focus();
  },

  'click .tag.delete.icon'(event, instance) {
    const target = event.currentTarget;
    const textContent = target.parentNode.textContent.trim();

    const instanceTags = instance.tags.get();
    let tagIdx = instanceTags.indexOf(textContent);

    instanceTags.splice(tagIdx, 1);
    instance.tags.set(instanceTags);
  },

  'click .ui.add.item.button'(event, instance) {
    const item = $('input[name=work-items]').val();
    if(item.trim().length !== 0) {
      const instanceItems = instance.items.get();
      instanceItems.push(item);
      instance.items.set(instanceItems);
    }

    $('input[name=work-items]').val("");
    $('input[name=work-items]').focus();
  },

  'click .item.delete.icon'(event, instance) {
    const target = event.currentTarget.parentNode.parentNode.parentNode;
    let idx = $(target).data("idx");

    const instanceItems = instance.items.get();
    instanceItems.splice(idx, 1);
    instance.items.set(instanceItems);
  },
});
