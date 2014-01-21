/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/ui/publisher',
  'sulfur/util/factory'
], function (Publisher, Factory) {

  'use strict';

  function parseHtml(s, tagName) {
    var e = document.createElement(tagName || 'div');
    e.innerHTML = s;
    return e.firstElementChild;
  }

  var dateHeadHtml =
    '<thead>' +
      '<tr>' +
        '<th><span class="calendar-close"></span></th>' +
        '<th><span class="calendar-reset" title="reset to current date"></span></th>' +
        '<th><span class="fa fa-caret-left"></span></th>' +
        '<th colspan="3"></th>' +
        '<th><span class="fa fa-caret-right"></span></th>' +
      '</tr>' +
      '<tr>' +
        '<th>M</th>' +
        '<th>T</th>' +
        '<th>W</th>' +
        '<th>T</th>' +
        '<th>F</th>' +
        '<th>S</th>' +
        '<th>S</th>' +
      '</tr>' +
    '</thead>';

  var timeHtml =
    '<table class="calendar-time">' +
      '<tr>' +
        '<td><span class="fa fa-caret-up"></span></td>' +
        '<td></td>' +
        '<td><span class="fa fa-caret-up"></span></td>' +
        '<td></td>' +
        '<td><span class="fa fa-caret-up"></span></td>' +
        '<td><span class="fa fa-caret-up"></span></td>' +
      '</tr>' +
      '<tr>' +
        '<td><input class="calendar-hour" type="text"/></td>' +
        '<td>:</td>' +
        '<td><input class="calendar-minute" type="text"/></td>' +
        '<td>:</td>' +
        '<td><input class="calendar-second" type="text"/></td>' +
        '<td><input class="calendar-timezone" type="text"/></td>' +
      '</tr>' +
      '<tr>' +
        '<td><span class="fa fa-caret-down"></span></td>' +
        '<td></td>' +
        '<td><span class="fa fa-caret-down"></span></td>' +
        '<td></td>' +
        '<td><span class="fa fa-caret-down"></span></td>' +
        '<td><span class="fa fa-caret-down"></span></td>' +
      '</tr>' +
    '</table>';

  var timezoneHtml =
    '<div class="calendar-date-timezone">' +
      '<span class="fa fa-caret-left"></span>' +
      '<input class="calendar-timezone" type="text"/>' +
      '<span class="fa fa-caret-right"></span>' +
    '</div>';

  var months = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC'
  ];

  var floor = Math.floor;

  function idiv(a, b) {
    return floor(a/b);
  }

  function modulo(a, n) {
    return a - idiv(a, n) * n;
  }

  function timezoneToString(tz) {
    if (typeof tz === 'undefined') {
      return '\u2015';
    }
    var negative = tz < 0;
    negative && (tz = -tz);
    var hr = idiv(tz, 60);
    var min = tz % 60;
    hr < 10 && (hr = '0' + hr);
    min < 10 && (min = '0' + min);
    return (negative ? '-' : '+') + hr + ':' + min;
  }

  var Date = Factory.clone({

    today: function () {
      var now = new window.Date();
      var y = now.getUTCFullYear();
      var m = now.getUTCMonth() + 1;
      var d = now.getUTCDate();
      var o = now.getTimezoneOffset();
      return this.create(y, m, d, o);
    }

  }).augment({

    initialize: function (year, month, day) {
      this._year = year;
      this._month = month;
      this._day = day;
    },

    get year() { return this._year },
    get month() { return this._month },
    get day() { return this._day },

    get isLeapYear() {
      var y = this.year;
      return y % 400 === 0 || y % 100 !== 0 && y % 4 === 0;
    },

    get lastDay() {
      switch (this.month) {
      case 1:
      case 3:
      case 5:
      case 7:
      case 8:
      case 10:
      case 12:
        return 31;
      case 4:
      case 6:
      case 9:
      case 11:
        return 30;
      case 2:
        return this.isLeapYear ? 29 : 28;
      }
    },

    get weekDay() {
      var d = this.day;
      var m = [0, 3, 3, 6, 1, 4, 6, 2, 5, 0, 3, 5][this.month - 1];
      var y = modulo(this.year, 100);
      y = (y + idiv(y, 4));
      var c = (3 - modulo(idiv(this.year, 100), 4)) * 2;
      var l = this.isLeapYear && (this.month === 1 || this.month === 2) ? -1 : 0;
      return modulo(d + m + c + y + l, 7);
    },

    shiftedWeekDay: function (shift) {
      return modulo(this.weekDay + shift, 7);
    },

    get withFirstDay() {
      return this.factory.create(this.year, this.month, 1);
    },

    get nextMonth() {
      var y = this.year;
      var m = this.month + 1;
      if (m === 13) {
        y += 1;
        m = 1;
      }
      return this.factory.create(y, m);
    },

    get previousMonth() {
      var y = this.year;
      var m = this.month - 1;
      if (m === 0) {
        y -= 1;
        m = 12;
      }
      return this.factory.create(y, m);
    },

    isSameMonth: function (other) {
      return this.year === other.year && this.month === other.month;
    },

    update: (function () {

      var P = 'year month day'.split(' ');
      var hasOwn = Object.prototype.hasOwnProperty;

      return function (p) {
        var a = P.map(function (k) {
          return hasOwn.call(p, k) ? p[k] : this[k];
        }.bind(this));
        return this.factory.create.apply(this.factory, a);
      };

    }())

  });

  var Time = Factory.clone({

    now: function () {
      var now = new window.Date();
      var h = now.getUTCHours();
      var m = now.getUTCMinutes();
      var s = now.getUTCSeconds();
      return this.create(h, m, s);
    }

  }).augment({

    initialize: function (hour, minute, second) {
      this._hour = hour;
      this._minute = minute;
      this._second = second;
    },

    get hour() { return this._hour },
    get minute() { return this._minute },
    get second() { return this._second },

    update: (function () {

      var P = 'hour minute second'.split(' ');
      var hasOwn = Object.prototype.hasOwnProperty;

      return function (p) {
        var a = P.map(function (k) {
          return hasOwn.call(p, k) ? p[k] : this[k];
        }.bind(this));
        return this.factory.create.apply(this.factory, a);
      };

    }())

  });

  return Factory.clone({

    createDate: Date.create.bind(Date),
    createTime: Time.create.bind(Time),
    today: Date.today.bind(Date),
    now: Time.now.bind(Time)

  }).augment({

    initialize: function (element, date, time, offset) {
      this._publisher = Publisher.create();
      this._element = element;

      this._dateElement = document.createElement('table');
      this._dateElement.className = 'calendar-date';
      this._timeElement = parseHtml(timeHtml);
      this._timezoneElement = parseHtml(timezoneHtml);

      var inputs = this._timeElement.querySelectorAll('input');
      var up = this._timeElement.querySelectorAll('.fa-caret-up');
      var down = this._timeElement.querySelectorAll('.fa-caret-down');
      this._hourInput = inputs[0];
      this._minuteInput = inputs[1];
      this._secondInput = inputs[2];
      this._timezoneInput = inputs[3];
      this._timezoneInput2 = this._timezoneElement.querySelector('input');

      up[0].addEventListener('click', this._increaseHour.bind(this));
      up[1].addEventListener('click', this._increaseMinute.bind(this));
      up[2].addEventListener('click', this._increaseSecond.bind(this));
      up[3].addEventListener('click', this._increaseTimezone.bind(this));
      this._timezoneElement.querySelector('.fa-caret-right').addEventListener('click', this._increaseTimezone.bind(this));

      down[0].addEventListener('click', this._decreaseHour.bind(this));
      down[1].addEventListener('click', this._decreaseMinute.bind(this));
      down[2].addEventListener('click', this._decreaseSecond.bind(this));
      down[3].addEventListener('click', this._decreaseTimezone.bind(this));
      this._timezoneElement.querySelector('.fa-caret-left').addEventListener('click', this._decreaseTimezone.bind(this));

      this._element.appendChild(this._dateElement);
      this._element.appendChild(this._timeElement);
      this._element.appendChild(this._timezoneElement);

      this._dateHead = parseHtml(dateHeadHtml, 'table');
      this._dateElement.appendChild(this._dateHead);

      this._dateMonthAndYear = this._dateHead.children[0].children[3];
      this._dateBody = document.createElement('tbody');
      this._dateElement.appendChild(this._dateBody);

      this._closeBtn = this._dateHead.children[0].children[0];
      this._resetBtn = this._dateHead.children[0].children[1];
      this._prevMonthBtn = this._dateHead.children[0].children[3];
      this._nextMonthBtn = this._dateHead.children[0].children[4];

      this._prevMonthBtn.addEventListener('click', this._selectPreviousMonth.bind(this));
      this._nextMonthBtn.addEventListener('click', this._selectNextMonth.bind(this));
      this._resetBtn.addEventListener('click', this._onReset.bind(this));
      this._closeBtn.addEventListener('click', this.hide.bind(this));

      this._dateBody.addEventListener('click', function (ev) {
        var e = ev.target;
        var day = parseInt(e.textContent, 10);
        var date = Date.create(this._displayDate.year, this._displayDate.month, day);
        this.update(date, this.time, this._offset);
        this.hide();
      }.bind(this));

      this.reset(date, time, offset);
    },

    get publisher() { return this._publisher },

    get date() { return this._date },
    get time() { return this._time },
    get offset() { return this._offset },

    show: function () {
      this._element.style.display = 'block';
    },

    hide: function () {
      this._element.style.display = '';
    },

    reset: function (date, time, offset) {
      // the currently selected date
      this._date = date;
      // the currently displayed date
      this._displayDate = date;
      // the currently selected date
      this._time = time;
      this._offset = offset;
      this.render();
    },

    render: function () {
      this.renderMonth(this._displayDate);
      if (this.time) {
        this.renderTime();
      } else {
        this.renderOffset();
      }
    },

    renderOffset: function () {
      this._timezoneElement.style.display = '';
      this._timeElement.style.display = 'none';
      this._timezoneInput2.value = timezoneToString(this.offset);
    },

    renderMonth: function (date) {
      var wday1 = date.withFirstDay.shiftedWeekDay(-1);
      var wday2 = date.nextMonth.withFirstDay.shiftedWeekDay(-1);

      var offset1 = wday1;
      var offset2 = wday2 > 0 ? 7 - wday2 : 0;
      var lastDay = date.lastDay;
      var weeks = idiv(lastDay + offset1 + offset2, 7) - 2;

      var html = '';

      var today = Date.today();

      var isPresentMonth = date.isSameMonth(today);
      var isCurrentMonth = date.isSameMonth(this._date);
      var currentDay = this._date.day;

      function renderDay(d, currentDay) {
        var className = 'day';
        if (isPresentMonth && d === today.day) {
          className += ' today';
        }
        if (isCurrentMonth && d === currentDay) {
          className += ' selected';
        }
        return '<td class="' + className + '">' + d + '</td>';
      }

      html += '<tr>';
      if (offset1 > 0) {
        html += '<td colspan="' + offset1 + '"></td>';
      }
      for (var i = 1; i <= 7 - offset1; i += 1) {
        html += renderDay(i, currentDay);
      }
      html += '</tr>';

      for (var w = 0; w < weeks; w += 1) {
        html += '<tr>';
        for (var j = 1; j <= 7; j += 1) {
          html += renderDay(j + (7 - offset1) + (w * 7), currentDay);
        }
        html += '</tr>';
      }

      html += '<tr>';
      for (var k = 0; k < 7 - offset2; k += 1) {
        html += renderDay(k + lastDay - (7 - offset2) + 1, currentDay);
      }
      if (offset2 > 0) {
        html += '<td colspan="' + offset2 + '"></td>';
      }
      html += '</tr>';

      this._dateMonthAndYear.textContent = months[date.month - 1] + ' ' + date.year;
      this._dateBody.innerHTML = html;
    },

    renderTime: function () {
      this._timezoneElement.style.display = 'none';
      this._timeElement.style.display = '';
      this._hourInput.value = this.time.hour;
      this._minuteInput.value = this.time.minute;
      this._secondInput.value = this.time.second;
      this._timezoneInput.value = timezoneToString(this.offset);
    },

    update: function (date, time, offset) {
      this._date = date;
      this._time = time;
      this._offset = offset;
      this.render();
      this._publisher.publish('change');
    },

    _increaseHour: function () {
      this._time = this.time.update({ hour: (this.time.hour + 1) % 24 });
      this.render();
    },

    _increaseMinute: function () {
      this._time = this.time.update({ minute: (this.time.minute + 1) % 60 });
      this.render();
    },

    _increaseSecond: function () {
      this._time = this.time.update({ second: (this.time.second + 1) % 60 });
      this.render();
    },

    _increaseTimezone: function () {
      if (typeof this._offset === 'undefined') {
        this._offset = 0;
      } else if (this._offset >= -30 && this._offset < 0) {
        this._offset = undefined;
      } else {
        this._offset += 30;
      }
      this.render();
    },

    _decreaseHour: function () {
      this._time = this.time.update({ hour: modulo(this.time.hour - 1, 24) });
      this.render();
    },

    _decreaseMinute: function () {
      this._time = this.time.update({ minute: modulo(this.time.minute - 1, 60) });
      this.render();
    },

    _decreaseSecond: function () {
      this._time = this.time.update({ second: modulo(this.time.second - 1, 60) });
      this.render();
    },

    _decreaseTimezone: function () {
      if (this._offset >= 0 && this._offset < 30) {
        this._offset = undefined;
      } else if (typeof this._offset === 'undefined') {
        this._offset = -30;
      } else {
        this._offset -= 30;
      }
      this.render();
    },

    _selectPreviousMonth: function () {
      this._displayDate = this._displayDate.previousMonth;
      this.renderMonth(this._displayDate);
    },

    _selectNextMonth: function () {
      this._displayDate = this._displayDate.nextMonth;
      this.renderMonth(this._displayDate);
    },

    _onReset: function () {
      this._publisher.publish('reset');
    }

  });

});
