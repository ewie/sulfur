/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/schema/value/simple/decimal'], function (DecimalValue) {

  'use strict';

  return DecimalValue.clone({

    /**
     * Parse a string representing an integer value (i.e. a decimal with no
     * fraction digits).
     *
     * @param {string} s the string representation
     *
     * @return {sulfur/schema/value/simple/integer} the parsed integer
     *
     * @throw {Error} if the string represent no valid integer
     */
    parse: (function () {

      /**
       * A regular expression matching an integer literal. Captures the
       * following groups:
       *
       *   $1 optional sign
       *   $2 integral digits
       */
      var pattern = /^[\x09\x0A\x0D\x20]*([+-]?)([0-9]+)[\x09\x0A\x0D\x20]*$/;

      return function (s) {
        var m = pattern.exec(s);
        if (!m) {
          throw new Error('invalid decimal integer "' + s + '"');
        }
        return this.create({
          integralDigits: m[2],
          positive: m[1] !== '-'
        });
      };

    }())

  }).augment({

    /**
     * @param {object} options
     *
     * @option options {string} integralDigits (default '0')
     *   the digits to the left of the period
     * @option options {string} fractionDigits (default '0')
     *   the digits to the right of the period, must be zero
     * @option options {boolean} positive (default true)
     *   whether the integer is positive
     */
    initialize: function (options) {
      DecimalValue.prototype.initialize.call(this, options);
      if (this.fractionDigits) {
        throw new Error("fractionDigits must be zero");
      }
    },

    /**
     * Convert the integer to its canonical string representation.
     *
     * @return {string} the string representation
     */
    toString: function () {
      var s = DecimalValue.prototype.toString.call(this);
      return s.substr(0, s.length - 2);
    }

  });

});
