/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/value/simple/dateTime',
  'sulfur/schema/value/simple/numeric'
], function (DateTimeValue, NumericValue) {

  'use strict';

  /**
   * Implemenation of XSD's date, which deviates from the current standard in
   * numerous ways to accomodate the datatype's behaviour exposed by the
   * DataGridService (via .NET). The .NET-Implemenation exposes the following
   * issues:
   *
   *   - it does not accept negative years
   *
   *   - it does not accept years greater than 9999
   *
   *   - it does accept timezones from -99:99 to +99:99
   *
   *   - it does not correctly compare two date instances when only one
   *     instance defines a timezone
   */

  return NumericValue.clone({

    /**
     * Parse a date literal and initialize a date object.
     *
     * @param {string} s a valid date literal
     *
     * @return {sulfur/schema/value/simple/date} the parsed date
     *
     * @throw {Error} if there are syntax errors
     * @throw {Error} if there are semantic errors (invalid date or timezone)
     */
    parse: (function () {

      /**
       * Regular expression to match a datetime literal. Captures the following
       * groups:
       *
       *   $1 year
       *   $2 month
       *   $3 day
       *   $4 optional timezone
       *   $5 signed timezone hour
       *   $6 timezone minute
       */
      var pattern = /^[\x09\x0A\x0D\x20]*([0-9]{4})-([0-9]{2})-([0-9]{2})(([+-][0-9]{2}):([0-9]{2})|Z)?[\x09\x0A\x0D\x20]*$/;

      function parseDec(s) {
        return parseInt(s, 10);
      }

      return function (s) {
        var m = pattern.exec(s);
        if (!m) {
          throw new Error('invalid date literal "' + s + '"');
        }
        var options = {
          year: parseDec(m[1]),
          month: parseDec(m[2]),
          day: parseDec(m[3])
        };
        if (m[4] === 'Z') {
          options.offset = 0;
        } else if (m[4]) {
          options.offset = parseDec(m[5]) * 60 + parseDec(m[6]);
        }
        try {
          return this.create(options);
        } catch (e) {
          throw new Error('invalid date literal "' + s + '", error: ' + e.message);
        }
      };

    }())

  }).augment({

    /**
     * Initialize the date with year, month, day and timezone. Normalizes the
     * date to UTC.
     *
     * @param {object} options (optional)
     *
     * @option options {number} year (default 1)
     * @option options {number} month (default 1)
     * @option options {number} day (default 1)
     * @option options {number} offset (optional)
     *
     * @throw {Error} if the date or timezone is not valid
     */
    initialize: function (options) {
      options || (options = {});

      // Represent the date by using a dateTime with the date's midpoint (noon).
      this._midpoint = DateTimeValue.create({
        year: options.year,
        month: options.month,
        day: options.day,
        hour: 12,
        offset: options.offset
      });
    },

    /**
     * @return {number} the year
     */
    get year() {
      return this._midpoint.year;
    },

    /**
     * @return {number} the month
     */
    get month() {
      return this._midpoint.month;
    },

    /**
     * @return {number} the day
     */
    get day() {
      return this._midpoint.day;
    },

    /**
     * Check if the date defines a timezone.
     *
     * @return {boolean} whether the date defines a timezone or not
     */
    hasTimezone: function () {
      return this._midpoint.hasTimezone();
    },

    /**
     * Convert this date to its string representation using the recoverable
     * timezone when defined.
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
        var s =
          toString(this.year, 4) + '-' +
          toString(this.month, 2) + '-' +
          toString(this.day, 2);

        if (this.hasTimezone()) {
          var tz = this.getRecoverableTimezone();
          if (tz.hour === 0 && tz.minute === 0) {
            s += 'Z';
          } else {
            var tzhr;
            var tzmin;
            var sign;

            if (tz.hour < 0) {
              tzhr = -tz.hour;
              sign = '-';
            } else if (tz.hour >= 0) {
              tzhr = tz.hour;
              sign = '+';
            }
            if (tz.minute < 0) {
              tzmin = -tz.minute;
            } else if (tz.minute >= 0){
              tzmin = tz.minute;
            }

            s += sign + toString(tzhr, 2) + ':' + toString(tzmin, 2);
          }
        }

        return s;
      };

    }()),

    /**
     * Get the recoverable timezone for this date.
     *
     * @return {object} the recoverable timezone as object with property `hour`
     *   and `minute`
     */
    getRecoverableTimezone: function () {
      if (!this.hasTimezone()) {
        return;
      }

      var dtn = this._midpoint;

      var dtu = DateTimeValue.create({
        year: this.year,
        month: this.month,
        day: this.day,
        hour: 12,
        tzhour: 0
      });

      var tzhour = dtu.hour - dtn.hour;
      var tzminute = dtu.minute - dtn.minute;

      // Handle an eventual overflow of the timezone minute.
      if (tzhour > 0 && tzminute < 0) {
        tzhour -= 1;
        tzminute += 60;
      }

      return { hour: tzhour, minute: tzminute };
    },

    /**
     * Compare with a datetime as RHS.
     *
     * @param {sulfur/schema/value/simple/date} other the RHS datetime
     *
     * @return {-1} if less than `other`
     * @return {0} if equal to `other`
     * @return {1} if greater than `other`
     */
    cmp: function (other) {
      return this._midpoint.cmp(other._midpoint);
    }

  });

});
