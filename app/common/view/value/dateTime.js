/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'text!app/common/html/value/dateTime.html',
  'sulfur/schema/value/simple/dateTime',
  'sulfur/schema/value/simple/decimal',
  'sulfur/ui/view',
  'sulfur/ui/view/access/value',
  'sulfur/ui/view/accessor',
  'sulfur/ui/view/blueprint',
  'sulfur/ui/view/calendar',
  'sulfur/ui/view/event',
  'sulfur/ui/view/event/dispatched',
  'sulfur/ui/view/event/published'
], function (
    html,
    DateTimeValue,
    DecimalValue,
    View,
    ValueAccess,
    Accessor,
    Blueprint,
    Calendar,
    Event,
    DispatchedEvent,
    PublishedEvent
) {

  'use strict';

  var blueprint = Blueprint.create({

    html: html,

    events: [
      Event.create('change', '[name = "value"]', PublishedEvent.create('change')),
      Event.create('click', '[name = "show-calendar"]', DispatchedEvent.create('showCalendar'))
    ],

    accessors: [
      Accessor.create('value', '[name = "value"]', ValueAccess)
    ]

  });

  return View.clone({

    get blueprint() { return blueprint }

  }).augment({

    initialize: function () {
      View.prototype.initialize.call(this);
      this._setupCalendar();
    },

    _setupCalendar: function () {
      var e = this.element.lastElementChild;
      var c = this._calendar = Calendar.create(e, Calendar.today(), Calendar.now());
      this._calendar.render();
      this._calendar.publisher.subscribe('change', function () {
        var d = c.date;
        var t = c.time;
        var dt = DateTimeValue.create({
          year: d.year,
          month: d.month,
          day: d.day,
          hour: t.hour,
          minute: t.minute,
          second: DecimalValue.parse(t.second.toString(10)),
          offset: c.offset
        });
        this.access('value').value = dt.toString();

        // XXX manually trigger the change event
        this.publisher.publish('change', this);
      }.bind(this));

      this._calendar.publisher.subscribe('reset', function () {
        c.reset(Calendar.today(), Calendar.now());
      });
    },

    get inputElementID() {
      return this.element.querySelector('[name = "value"]').id;
    },

    showCalendar: function () {
      var value = this.access('value').value;
      var dt;
      try {
        dt = DateTimeValue.parse(value);
      } catch (e) {
        // ignore
      }
      if (dt) {
        var date = Calendar.createDate(dt.year, dt.month, dt.day);
        var time = Calendar.createTime(
          dt.hour, dt.minute, parseFloat(dt.second.toString()),
          dt.hasTimezone() ? 0 : undefined);
        this._calendar.update(date, time);
      }
      this._calendar.show();
    }

  });

});
