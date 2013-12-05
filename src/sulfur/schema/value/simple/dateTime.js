/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/value/simple/decimal',
  'sulfur/schema/value/simple/numeric',
  'sulfur/util'
], function (DecimalValue, NumericValue, util) {

  'use strict';

  /**
   * Implemenation of XSD's dateTime, which deviates from the current standard
   * in numerous ways to accomodate the datatype's behaviour exposed by the
   * DataGridService (via .NET). The .NET-Implemenation exposes the following
   * issues:
   *
   *   - it does not accept negative years
   *
   *   - it does not accept years greater than 9999
   *
   *   - it does not accept time-of-day 24:00:00, which evaluates to 00:00:00
   *     on the next day
   *
   *   - it does not accept leap seconds, i.e. 2012-06-30T23:59:60Z
   *
   *   - it does accept timezones from -99:99 to +99:99
   *
   *   - it does not correctly compare two datetime instances when only one
   *     instance defines a timezone
   */

  function isLeapYear(year) {
    return year % 400 === 0 || year % 100 !== 0 && year % 4 === 0;
  }

  return NumericValue.clone({

    /**
     * Parse a dateTime literal according to XML Schema 1.0 as used by the
     * DataGridService.
     *
     * @param {string} s
     *
     * @return {sulfur/schema/value/simple/dateTime} the parsed datetime
     *
     * @throw {Error} on an invalid string representation or invalid values
     */
    parse: (function () {

      /**
       * Regular expression to match a datetime literal. Captures the following
       * groups:
       *
       *   $1 year
       *   $2 month
       *   $3 day
       *   $4 hour
       *   $5 minute
       *   $6 second with optional fractional part
       *   $7 optional timezone
       *   $8 signed timezone hour
       *   $9 timezone minute
       */
      var pattern = /^[\x09\x0A\x0D\x20]*([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2}(?:\.[0-9]+)?)(([+-][0-9]{2}):([0-9]{2})|Z)?[\x09\x0A\x0D\x20]*$/;

      function parseDec(s) {
        return parseInt(s, 10);
      }

      return function (s) {

        var m = pattern.exec(s);
        if (!m) {
          throw new Error('invalid datetime literal "' + s + '"');
        }
        var options = {
          year: parseDec(m[1]),
          month: parseDec(m[2]),
          day: parseDec(m[3]),
          hour: parseDec(m[4]),
          minute: parseDec(m[5]),
          second: DecimalValue.parse(m[6])
        };
        if (m[7] === 'Z') {
          options.tzhour = options.tzminute = 0;
        } else if (m[7]) {
          options.tzhour = parseDec(m[8]);
          options.tzminute = parseDec(m[9]);
        }
        try {
          return this.create(options);
        } catch (e) {
          throw new Error('invalid datetime literal "' + s + '", error: ' + e.message);
        }

      };

    }())

  }).augment({

    /**
     * Initialize the datetime with year, month, day, hour, minute, second and
     * a timezone. Normalized the datetime to UTC.
     *
     * @param {object} options (optional)
     *
     * @option options {number} year (default 1)
     * @option options {number} month (default 1)
     * @option options {number} day (default 1)
     * @option options {number} hour (default 0)
     * @option options {number} minute (default 0)
     * @option options {sulfur/schema/value/simple/decimal} second (default 0)
     * @option options {number} tzhour (default 0 if `tzminute` is given)
     * @option options {number} tzminute (default 0 if `tzhour` is given)
     *
     * @throw {Error} on values outside their valid range and on invalid date,
     *   time or timezone
     */
    initialize: (function () {

      function sgn(x) {
        if (x < 0) {
          return -1;
        }
        if (x > 0) {
          return 1;
        }
        return 0;
      }

      function assertYear(year) {
        if (!util.isInteger(year)) {
          throw new Error("year must be an integer");
        }

        if (year < 1) {
          throw new Error("year must not be less than 1");
        }

        if (year > 9999) {
          throw new Error("year must not be greater than 9999");
        }
      }

      function assertMonth(month) {
        if (!util.isInteger(month)) {
          throw new Error("month must be an integer");
        }

        if (month < 1) {
          throw new Error("month must not be less than 1");
        }

        if (month > 12) {
          throw new Error("month must not be greater than 12");
        }
      }

      function assertDay(day, month, year) {
        if (!util.isInteger(day)) {
          throw new Error("day must be an integer");
        }

        if (day < 1) {
          throw new Error("day must not be less than 1");
        }

        if ((month < 8 && month % 2 === 1 || month > 7 && month % 2 === 0) && day > 31) {
          throw new Error("day must not be greater than 31 for month 1, 3, 5, 7, 8, 10 and 12");
        }

        if ((month === 4 || month === 6 || month === 9 || month === 11) && day > 30) {
          throw new Error("day must not be greater than 30 for month 4, 6, 9 and 11");
        }

        if (month === 2) {
          if (isLeapYear(year)) {
            if (day > 29) {
              throw new Error("day must not be greater than 29 for month 2 in leap years");
            }
          } else if (day > 28) {
            throw new Error("day must not be greater than 29 for month 2 in non-leap years");
          }
        }
      }

      function assertHour(hour) {
        if (!util.isInteger(hour)) {
          throw new Error("hour must be an integer");
        }

        if (hour < 0) {
          throw new Error("hour must be non-negative");
        }

        if (hour > 23) {
          throw new Error("hour must not be greater than 23");
        }
      }

      function assertMinute(minute) {
        if (!util.isInteger(minute)) {
          throw new Error("minute must be an integer");
        }

        if (minute < 0) {
          throw new Error("minute must be non-negative");
        }

        if (minute > 59) {
          throw new Error("minute must not be greater than 59");
        }
      }

      var MIN_SECOND = DecimalValue.create();
      var MAX_SECOND = DecimalValue.parse('60');

      function assertSecond(second) {
        if (!DecimalValue.prototype.isPrototypeOf(second)) {
          throw new Error("second must be a decimal");
        }
        if (second.lt(MIN_SECOND)) {
          throw new Error("second must be non-negative");
        }
        if (second.gteq(MAX_SECOND)) {
          throw new Error("second must not be greater than or equal to 60");
        }
      }

      function assertTimezoneHour(hour) {
        if (!util.isInteger(hour)) {
          throw new Error("timezone hour must be an integer");
        }
        if (hour > 99) {
          throw new Error("timezone hour must not be greater than 99");
        }
        if (hour < -99) {
          throw new Error("timezone hour must not be less than -99");
        }
      }

      function assertTimezoneMinute(minute) {
        if (!util.isInteger(minute)) {
          throw new Error("timezone minute must be an integer");
        }
        if (minute > 99) {
          throw new Error("timezone minute must not be greater than 99");
        }
        if (minute < -99) {
          throw new Error("timezone minute must not be less than -99");
        }
      }

      function assertDate(year, month, day) {
        assertYear(year);
        assertMonth(month);
        assertDay(day, month, year);
      }

      function assertTime(hour, minute, second) {
        assertHour(hour);
        assertMinute(minute);
        assertSecond(second);
      }

      function assertTimezone(hour, minute) {
        assertTimezoneHour(hour);
        assertTimezoneMinute(minute);

        if (hour !== 0 && minute !== 0 && sgn(hour) !== sgn(minute)) {
          throw new Error("timezone hour and minute must be of the same sign for a non-zero hour");
        }
      }

      function optionOrDefault(options, property, default_) {
        return util.isDefined(options[property]) ? options[property] : default_;
      }

      var normalizeToZulu = (function () {

        function maximumDayInMonth(month, year) {
          month = modulo2(month, 1, 13);
          year += quotient2(month, 1, 13);
          if (month === 2) {
            return isLeapYear(year) ? 29 : 28;
          }
          if (month < 8 && month % 2 === 1 || month >= 8 && month % 2 === 0) {
            return 31;
          }
          return 30;
        }

        function modulo(a, b) {
          return a - quotient(a, b) * b;
        }

        function modulo2(a, min, max) {
          return modulo(a - min, max - min) + min;
        }

        function quotient(a, b) {
          return Math.floor(a/b);
        }

        function quotient2(a, min, max) {
          return quotient(a - min, max - min);
        }

        return function (year, month, day, hour, minute, second, tzhour, tzminute) {

          var tmp = minute - tzminute;
          minute = modulo(tmp, 60);
          var carry = quotient(tmp, 60);

          tmp = hour - tzhour + carry;
          hour = modulo(tmp, 24);
          carry = quotient(tmp, 24);

          day += carry;

          for (;;) {
            if (day < 1) {
              day += maximumDayInMonth(month - 1, year);
              carry = -1;
            } else if (day > maximumDayInMonth(month, year)) {
              day -= maximumDayInMonth(month, year);
              carry = 1;
            } else {
              break;
            }

            tmp = month + carry;
            month = modulo2(tmp, 1, 13);
            year += quotient2(tmp, 1, 13);
          }

          if (year < 1) {
            throw new Error("cannot normalize if year will be less than 1");
          }

          if (year > 9999) {
            throw new Error("cannot normalize if year will be greater than 9999");
          }

          return {
            year: year,
            month: month,
            day: day,
            hour: hour,
            minute: minute,
            second: second
          };

        };

      }());

      return function (options) {

        options || (options = {});

        var year = optionOrDefault(options, 'year', 1);
        var month = optionOrDefault(options, 'month', 1);
        var day = optionOrDefault(options, 'day', 1);

        assertDate(year, month, day);

        var hour = optionOrDefault(options, 'hour', 0);
        var minute = optionOrDefault(options, 'minute', 0);
        var second = optionOrDefault(options, 'second', DecimalValue.create());

        assertTime(hour, minute, second);

        if (util.isDefined(options.tzhour) || util.isDefined(options.tzminute)) {
          var tzhour = optionOrDefault(options, 'tzhour', 0);
          var tzminute = optionOrDefault(options, 'tzminute', 0);
          assertTimezone(tzhour, tzminute);
          var n = normalizeToZulu(year, month, day, hour, minute, second, tzhour, tzminute);
          this._year = n.year;
          this._month = n.month;
          this._day = n.day;
          this._hour = n.hour;
          this._minute = n.minute;
          this._second = n.second;
          this._zulu = true;
        } else {
          this._year = year;
          this._month = month;
          this._day = day;
          this._hour = hour;
          this._minute = minute;
          this._second = second;
          this._zulu = false;
        }

      };

    }()),

    /**
     * @return {number} the year
     */
    get year() {
      return this._year;
    },

    /**
     * @return {number} the month
     */
    get month() {
      return this._month;
    },

    /**
     * @return {number} the day
     */
    get day() {
      return this._day;
    },

    /**
     * @return {number} the hour
     */
    get hour() {
      return this._hour;
    },

    /**
     * @return {number} the minute
     */
    get minute() {
      return this._minute;
    },

    /**
     * @return {sulfur/schema/value/simple/decimal} the second
     */
    get second() {
      return this._second;
    },

    /**
     * Convert the datetime to its string representation.
     *
     * @return {string} the string representation
     */
    toString: (function () {

      function toString(value, length) {
        var s = value.toString(10);
        while (s.length < length) {
          s = '0' + s;
        }
        return s;
      }

      return function () {

        var sec = this._second.toString();
        if (sec.length < 2 || sec.indexOf('.') === 1) {
          sec = '0' + sec;
        }

        var s =
          toString(this._year, 4) + '-' +
          toString(this._month, 2) + '-' +
          toString(this._day, 2) + 'T' +
          toString(this._hour, 2) + ':' +
          toString(this._minute, 2) + ':' + sec;

        if (this.hasTimezone()) {
          s += 'Z';
        }

        return s;

      };

    }()),

    /**
     * Check if the datetime defines a timezone.
     *
     * @return {boolean} whether a timezone is defined or not
     */
    hasTimezone: function () {
      return this._zulu;
    },

    /**
     * Compare this datetime on the LHS with another datetime on the RHS.
     *
     * Because the DataGridService ignores the timezone of either datetime,
     * the comparison only considers year, month, day, hour, minute and second.
     *
     * @param {sulfur/schema/value/simple/dateTime} other the RHS datetime
     *
     * @return {-1} if less than `other`
     * @return {0} if equal to `other`
     * @return {1} if greater than `other`
     */
    cmp: (function () {

      // All properties which can be compared numerically.
      var PROPERTIES = '_year _month _day _hour _minute'.split(' ');

      return function (other) {

        for (var i = 0, p; i < PROPERTIES.length; i += 1) {
          p = PROPERTIES[i];
          if (this[p] < other[p]) {
            return -1;
          }
          if (this[p] > other[p]) {
            return 1;
          }
        }

        return this._second.cmp(other._second);

      };

    }())

  });

});
