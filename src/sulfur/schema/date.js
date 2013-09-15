/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/factory',
  'sulfur/schema/dateTime'
], function ($factory, $dateTime) {

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

  var $ = $factory.clone({

    /**
     * Check if a string represents a valid date literal.
     *
     * @param [string] s the string to check
     *
     * @return [boolean] whether `s` represents a valid date literal or not
     */
    isValidLiteral: function (s) {
      try {
        this.parse(s);
      } catch (e) {
        return false;
      }
      return true;
    },

    /**
     * Parse a date literal and initialize a date object.
     *
     * @param [string] s a valid date literal
     *
     * @return [sulfur/schema/date] the parsed date
     *
     * @throw [Error] if there are syntax errors
     * @throw [Error] if there are semantic errors (invalid date or timezone)
     */
    parse: (function () {

      var DATE_PATTERN = /^(-?[0-9]{4})-([0-9]{2})-([0-9]{2})(([+-][0-9]{2}):([0-9]{2})|Z)?$/;

      function parseDec(s) {
        return parseInt(s, 10);
      }

      return function (s) {
        var m = DATE_PATTERN.exec(s);
        if (!m) {
          throw new Error('invalid date literal "' + s + '"');
        }
        var options = {
          year: parseDec(m[1]),
          month: parseDec(m[2]),
          day: parseDec(m[3])
        };
        if (m[4] === 'Z') {
          options.tzhour = options.tzminute = 0;
        } else if (m[4]) {
          options.tzhour = parseDec(m[5]);
          options.tzminute = parseDec(m[6]);
        }
        try {
          return this.create(options);
        } catch (e) {
          throw new Error('invalid date literal "' + s + '", error: ' + e.message);
        }
      };

    }())

  });

  $.augment({

    /**
     * @param [object] options
     *
     * @option options [number] year (default 1)
     * @option options [number] month (default 1)
     * @option options [number] day (default 1)
     * @option options [number] tzhour (default 0 when `tzminute` given)
     * @option options [number] tzminute (default 0 when `tzhour` given)
     *
     * @throw [Error] if the date or timezone is not valid
     */
    initialize: function (options) {
      options || (options = {});

      // Represent the date by using a dateTime with the date's midpoint (noon).
      this._midpoint = $dateTime.create({
        year: options.year,
        month: options.month,
        day: options.day,
        hour: 12,
        tzhour: options.tzhour,
        tzminute: options.tzminute
      });
    },

    /**
     * @return [number] the year
     */
    getYear: function () {
      return this._midpoint.getYear();
    },

    /**
     * @return [number] the month
     */
    getMonth: function () {
      return this._midpoint.getMonth();
    },

    /**
     * @return [number] the day
     */
    getDay: function () {
      return this._midpoint.getDay();
    },

    /**
     * @return [number] the timezone hour, if a timezone is defined
     * @return [undefined] if not timezone is defined
     */
    getTimezoneHour: function () {
      return this._midpoint.getTimezoneHour();
    },

    /**
     * @return [number] the timezone minute, if a timezone is defined
     * @return [undefined] if not timezone is defined
     */
    getTimezoneMinute: function () {
      return this._midpoint.getTimezoneMinute();
    },

    /**
     * Check if the date defines a timezone.
     *
     * @return [boolean] whether the date defines a timezone or not
     */
    hasTimezone: function () {
      return this._midpoint.hasTimezone();
    },

    /**
     * Check if the date is UTC.
     *
     * @return [boolean] whether the date is UTC or not
     */
    isZulu: function () {
      return this._midpoint.isZulu();
    },

    /**
     * Get the literal using the timezone as initialized.
     *
     * @return [string] the literal
     */
    toLiteral: function () {
      return this._midpoint.toLiteral().replace('T12:00:00', '');
    },

    /**
     * Get the canonical literal, i.e. of the normalized form.
     *
     * @return [string] the canonical literal
     */
    toCanonicalLiteral: function () {
      return this.normalize().toLiteral();
    },

    /**
     * Normalize the date to use a recoverable timezone.
     *
     * @return [sulfur/schema/date] a date with recoverable timezone
     * @return [this] the date if it has no timezone or its timezone is
     *   identical to its recoverable timezone
     *
     * @throw [Error] if the normalized date would be invalid (1 > year > 9999)
     */
    normalize: function () {
      if (!this.hasTimezone()) {
        return this;
      }

      if (this.getTimezoneHour() >= -11 && this.getTimezoneHour() < 12 ||
          this.getTimezoneHour() === 12 && this.getTimezoneMinute() === 0)
      {
        return this;
      }

      var dtn = this._midpoint.normalize();

      var dtu = $dateTime.create({
        year: this.getYear(),
        month: this.getMonth(),
        day: this.getDay(),
        hour: 12,
        tzhour: 0
      });

      var tzhr = dtu.getHour() - dtn.getHour();
      var tzmin = dtu.getMinute() - dtn.getMinute();

      // Handle an eventual overflow of the timezone minute.
      if (tzhr > 0 && tzmin < 0) {
        tzhr -= 1;
        tzmin += 60;
      }

      return $.create({
        year: dtn.getYear(),
        month: dtn.getMonth(),
        day: dtn.getDay(),
        tzhour: tzhr,
        tzminute: tzmin
      });
    },

    /**
     * Compare with a datetime as RHS.
     *
     * @param [sulfur/schema/date] other the RHS datetime
     *
     * @return [-1] if less than `other`
     * @return [0] if equal to `other`
     * @return [1] if greater than `other`
     */
    cmp: function (other) {
      return this._midpoint.cmp(other._midpoint);
    },

    /**
     * Check for equality with another date.
     *
     * @param [sulfur/schema/date] other
     *
     * @return [boolean] whether equal to `other` or not
     */
    eq: function (other) {
      return this.cmp(other) === 0;
    },

    /**
     * Check if less than another date.
     *
     * @param [sulfur/schema/date] other
     *
     * @return [boolean] whether less than `other` or not
     */
    lt: function (other) {
      return this.cmp(other) < 0;
    },

    /**
     * Check if greater than another date.
     *
     * @param [sulfur/schema/date] other
     *
     * @return [boolean] whether greater than `other` or not
     */
    gt: function (other) {
      return this.cmp(other) > 0;
    },

    /**
     * Check if less than or equal to another date.
     *
     * @param [sulfur/schema/date] other
     *
     * @return [boolean] whether less than or equal `other` or not
     */
    lteq: function (other) {
      return !this.gt(other);
    },

    /**
     * Check if greater than or equal to another date.
     *
     * @param [sulfur/schema/date] other
     *
     * @return [boolean] whether greater than or equal to `other` or not
     */
    gteq: function (other) {
      return !this.lt(other);
    }

  });

  return $;

});
