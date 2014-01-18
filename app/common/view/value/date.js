/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'app/common/view/value/dateTime',
  'sulfur/schema/value/simple/date',
  'sulfur/ui/view/calendar'
], function (DateTimeValueView, DateValue, Calendar) {

  'use strict';

  return DateTimeValueView.derive({

    _setupCalendar: function () {
      var e = this.element.lastElementChild;
      var c = this._calendar = Calendar.create(e, Calendar.today());
      this._calendar.render();
      this._calendar.publisher.subscribe('change', function () {
        var d = c.date;
        var dt = DateValue.create({
          year: d.year,
          month: d.month,
          day: d.day,
          offset: c.offset
        });
        this.access('value').value = dt.toString();

        // XXX manually trigger the change event
        this.publisher.publish('change', this);
      }.bind(this));

      this._calendar.publisher.subscribe('reset', function () {
        c.reset(Calendar.today());
      });
    },

    showCalendar: function () {
      var value = this.access('value').value;
      var dt;
      try {
        dt = DateValue.parse(value);
      } catch (e) {
        // ignore
      }
      if (dt) {
        var date = Calendar.createDate(dt.year, dt.month, dt.day);
        this._calendar.update(date, null, dt.hasTimezone() ? 0 : undefined);
      }
      this._calendar.show();
    }

  });

});
