/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/object',
  'sulfur/schema/decimal'
], function ($object, $decimal) {

  'use strict';

  /**
   * Implemenation of XSD's dateTime, which deviates from the current standard
   * in numerous ways to accomodate the datatypes behaviour exposed by the
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
   */

  function isLeapYear(year) {
    return year % 400 === 0 || year % 100 !== 0 && year % 4 === 0;
  }

  function isDefined(obj) {
    return typeof obj !== 'undefined';
  }

  var $dateTime = $object.clone({

    /**
     * Check if a string represents a valid dateTime according to XML Schema 1.0
     * as used by the DataGridService.
     *
     * @param [string] s
     *
     * @return [boolean]
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
     * Parse a dateTime literal according to XML Schema 1.0 as used by the
     * DataGridService.
     *
     * @param [string] s
     *
     * @return [dateTime] the parsed datetime
     *
     * @throw [Error] on an invalid string representation or invalid values
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
       *   $7 optional time zone
       *   $8 signed time zone hour
       *   $9 time zone minute
       */
      var DATETIME_PATTERN = /^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2}(?:\.[0-9]+)?)(([+-][0-9]{2}):([0-9]{2})|Z)?$/;

      function parseDec(s) {
        return parseInt(s, 10);
      }

      return function (s) {

        var m = DATETIME_PATTERN.exec(s);
        if (!m) {
          throw new Error('invalid datetime literal "' + s + '"');
        }
        try {
          var options = {
            year: parseDec(m[1]),
            month: parseDec(m[2]),
            day: parseDec(m[3]),
            hour: parseDec(m[4]),
            minute: parseDec(m[5]),
            second: m[6]
          };
          if (m[7] === 'Z') {
            options.tzhour = options.tzminute = 0;
          } else if (m[7]) {
            options.tzhour = parseDec(m[8]);
            options.tzminute = parseDec(m[9]);
          }
          return this.create(options);
        } catch (e) {
          throw new Error('invalid datetime literal "' + s + '", error: ' + e.message);
        }

      };

    }())

  });

  $dateTime.augment({

    /**
     * @param [object] options
     *
     * @option options [number] year (default 1)
     * @option options [number] month (default 1)
     * @option options [number] day (default 1)
     * @option options [number] hour (default 0)
     * @option options [number] minute (default 0)
     * @option options [number, string, decimal] second (default 0)
     * @option options [number] tzhour (default 0 if `tzminute` is given)
     * @option options [number] tzminute (default 0 if `tzhour` is given)
     *
     * @throw [Error] on values outside their valid range and on invalid date,
     *   time or time zone
     */
    initialize: (function () {

      function isInteger(x) {
        return ~~x === x;
      }

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
        if (!isInteger(year)) {
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
        if (!isInteger(month)) {
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
        if (!isInteger(day)) {
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
        if (!isInteger(hour)) {
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
        if (!isInteger(minute)) {
          throw new Error("minute must be an integer");
        }

        if (minute < 0) {
          throw new Error("minute must be non-negative");
        }

        if (minute > 59) {
          throw new Error("minute must not be greater than 59");
        }
      }

      function assertSecond(second) {
        if (typeof second === 'number') {
          if (!isInteger(second)) {
            throw new Error("second must be an integer");
          }
          second = $decimal.parse(second.toString(10));
        } else if (typeof second === 'string') {
          if (!$decimal.isDecimal(second)) {
            throw new Error('invalid second value "' + second + '"');
          }
          second = $decimal.parse(second);
        }
        var MIN = $decimal.parse('0');
        if (second.lt(MIN)) {
          throw new Error("second must be non-negative");
        }
        var MAX = $decimal.parse('60');
        if (second.gteq(MAX)) {
          throw new Error("second must not be greater than or equal to 60");
        }
      }

      function assertTimeZoneHour(hour) {
        if (hour > 14) {
          throw new Error("time zone hour must not be greater than 14");
        }
        if (hour < -14) {
          throw new Error("time zone hour must not be less than -14");
        }
      }

      function assertTimeZoneMinute(minute) {
        if (minute > 59) {
          throw new Error("time zone minute must not be greater than 59");
        }
        if (minute < -59) {
          throw new Error("time zone minute must not be less than -59");
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

      function assertTimeZone(hour, minute) {
        assertTimeZoneHour(hour);
        assertTimeZoneMinute(minute);

        if (hour === 14 && minute !== 0) {
          throw new Error("time zone must not be greater than +14:00");
        }

        if (hour === -14 && minute !== 0) {
          throw new Error("time zone must not be less than -14:00");
        }

        if (hour !== 0 && minute !== 0 && sgn(hour) !== sgn(minute)) {
          throw new Error("time zone hour and minute must be of the same sign for a non-zero hour");
        }
      }

      function optionOrDefault(options, property, default_) {
        return isDefined(options[property]) ? options[property] : default_;
      }

      return function (options) {

        options || (options = {});

        var year = optionOrDefault(options, 'year', 1);
        var month = optionOrDefault(options, 'month', 1);
        var day = optionOrDefault(options, 'day', 1);

        assertDate(year, month, day);

        var hour = optionOrDefault(options, 'hour', 0);
        var minute = optionOrDefault(options, 'minute', 0);
        var second = optionOrDefault(options, 'second', 0);

        assertTime(hour, minute, second);

        if (typeof second === 'number') {
          second = $decimal.parse(second.toString(10));
        } else if (typeof second === 'string') {
          second = $decimal.parse(second);
        }

        var tzhour;
        var tzminute;

        if (isDefined(options.tzhour) || isDefined(options.tzminute)) {
          tzhour = optionOrDefault(options, 'tzhour', 0);
          tzminute = optionOrDefault(options, 'tzminute', 0);
          assertTimeZone(tzhour, tzminute);
        }

        this.year = year;
        this.month = month;
        this.day = day;

        this.hour = hour;
        this.minute = minute;
        this.second = second;

        if (isDefined(tzhour)) {
          this.tzhour = tzhour;
          this.tzminute = tzminute;
        }

      };

    }()),

    /**
     * Convert the datetime to its string representation.
     *
     * @return [string] the string representation
     */
    toLiteral: (function () {

      function pad(s, n) {
        while (s.length < n) {
          s = '0' + s;
        }
        return s;
      }

      function toString(value, length) {
        return pad(value.toString(10), length);
      }

      return function () {

        var sec = this.second.toLiteral();
        if (sec === '0' || sec.indexOf('.') === 1) {
          sec = '0' + sec;
        }

        var s = toString(this.year, 4) + '-' + toString(this.month, 2) + '-' + toString(this.day, 2) +
                'T' + toString(this.hour, 2) + ':' + toString(this.minute, 2) + ':' + sec;

        if (this.isZulu()) {
          s += 'Z';
        } else if (this.hasTimeZone()) {
          var tzhr = 0;
          var tzmin = 0;
          if (this.tzhour < 0) {
            s += '-';
            tzhr = -this.tzhour;
          } else if (this.tzhour > 0) {
            s += '+';
            tzhr = this.tzhour;
          } else if (this.tzminute < 0) {
            s += '-';
            tzmin = -this.tzminute;
          } else {
            s += '+';
            tzmin = this.tzminute;
          }
          s += toString(tzhr, 2) + ':' + toString(tzmin, 2);
        }

        return s;

      };

    }()),

    /**
     * Convert the datetime to its canonical string representation, i.e. the
     * string representation of the normalized form.
     *
     * @return [string].
     */
    toCanonicalLiteral: function () {
      return this.normalize().toLiteral();
    },

    /**
     * Check if the datetime defines a time zone.
     *
     * @return [boolean] whether a time zone is defined or not
     */
    hasTimeZone: function () {
      return isDefined(this.tzhour);
    },

    /**
     * Check if the datetime is UTC.
     *
     * @return [boolean] whether it's UTC or not
     */
    isZulu: function () {
      return this.tzhour === 0 && this.tzminute === 0;
    },

    /**
     * Normalize this datetime by applying the time zone offset resulting in a
     * UTC datetime.
     *
     * @return [dateTime] the normalized datetime in UTC
     * @return [this] the datetime if it has no time zone or already is UTC
     *
     * @throw [Error] if the resulting datetime is invalid (1 > year > 9999)
     */
    normalize: (function () {

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

      return function () {

        if (!this.hasTimeZone() || this.isZulu()) {
          return this;
        }

        var tzhr = this.tzhour;
        var tzmin = this.tzminute;

        var year = this.year;
        var month = this.month;

        var tmp = this.minute - tzmin;
        var minute = modulo(tmp, 60);
        var carry = quotient(tmp, 60);

        tmp = this.hour - tzhr + carry;
        var hour = modulo(tmp, 24);
        carry = quotient(tmp, 24);

        var day = this.day + carry;

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

        return $dateTime.create({
          year: year,
          month: month,
          day: day,
          hour: hour,
          minute: minute,
          second: this.second,
          tzhour: 0
        });

      };

    }()),

    /**
     * Compare with a datetime as RHS.
     *
     * @param [dateTime] other the RHS datetime
     *
     * @return [-1] if less than `other`
     * @return [0] if equal to `other`
     * @return [1] if greater than `other`
     */
    cmp: (function () {

      // All properties which can be compared numerically.
      var PROPERTIES = 'year month day hour minute'.split(' ');

      function addTimeZone(dt, tzhour) {
        return $dateTime.create({
          year: dt.year,
          month: dt.month,
          day: dt.day,
          hour: dt.hour,
          minute: dt.minute,
          second: dt.second,
          tzhour: tzhour
        }).normalize();
      }

      return function (other) {

        var lhs, rhs;

        if (this.hasTimeZone() && other.hasTimeZone() && !this.isZulu() && !other.isZulu()) {
          lhs = this.normalize();
          rhs = other.normalize();
          return lhs.cmp(rhs);
        }

        if (this.hasTimeZone() && !other.hasTimeZone()) {
          lhs = this.normalize();
          rhs = addTimeZone(other, 14);
          if (lhs.lt(rhs)) {
            return -1;
          }
          rhs = addTimeZone(other, -14);
          if (lhs.gt(rhs)) {
            return 1;
          }
          return undefined;
        }

        if (!this.hasTimeZone() && other.hasTimeZone()) {
          rhs = other.normalize();
          lhs = addTimeZone(this, -14);
          if (lhs.lt(rhs)) {
            return -1;
          }
          lhs = addTimeZone(this, 14);
          if (lhs.gt(rhs)) {
            return 1;
          }
          return undefined;
        }

        lhs = this;
        rhs = other;

        for (var i = 0, p; i < PROPERTIES.length; i += 1) {
          p = PROPERTIES[i];
          if (lhs[p] < rhs[p]) {
            return -1;
          }
          if (lhs[p] > rhs[p]) {
            return 1;
          }
        }

        return lhs.second.cmp(rhs.second);

      };

    }()),

    /**
     * Check for equality with another datetime.
     *
     * @param [dateTime] other
     *
     * @return [boolean] whether equal to `other` or not
     */
    eq: function (other) {
      return this.cmp(other) === 0;
    },

    /**
     * Check if less than another datetime.
     *
     * @param [dateTime] other
     *
     * @return [boolean] whether less than `other` or not
     */
    lt: function (other) {
      return this.cmp(other) < 0;
    },

    /**
     * Check if greater than another datetime.
     *
     * @param [dateTime] other
     *
     * @return [boolean] whether greater than `other` or not
     */
    gt: function (other) {
      return this.cmp(other) > 0;
    },

    /**
     * Check if less than or equal to another datetime.
     *
     * @param [dateTime] other
     *
     * @return [boolean] whether less than or equal `other` or not
     */
    lteq: function (other) {
      return !this.gt(other);
    },

    /**
     * Check if greater than or equal to another datetime.
     *
     * @param [dateTime] other
     *
     * @return [boolean] whether greater than or equal to `other` or not
     */
    gteq: function (other) {
      return !this.lt(other);
    }

  });

  return $dateTime;

});
