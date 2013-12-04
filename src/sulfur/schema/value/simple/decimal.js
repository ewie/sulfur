/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/value/simple/numeric',
  'sulfur/util'
], function (NumericValue, util) {

  'use strict';

  /**
   * Implemenation of XSD's decimal using regular strings for representation
   * and comparison.
   */

  /**
   * A regular expression matching a decimal literal. Captures the following
   * groups:
   *
   *   $1 optional sign
   *   $2 integral digits
   *   $3 optional fraction digits
   */
  var LITERAL_PATTERN = /^[\x09\x0A\x0D\x20]*([+-])?([0-9]+)(?:\.([0-9]+))?[\x09\x0A\x0D\x20]*$/;

  return NumericValue.clone({

    /**
     * Check if a string represents a valid decimal value.
     *
     * @param {string} s the string representation
     *
     * @return {boolean} whether the representation is valid
     */
    isValidLiteral: function (s) {
      return LITERAL_PATTERN.test(s);
    },

    /**
     * Parse a string representing a decimal value.
     *
     * @param {string} s the string representation
     *
     * @return {decimal} the parsed decimal
     *
     * @throw {Error} if the string represents no valid decimal
     */
    parse: function (s) {
      var m = LITERAL_PATTERN.exec(s);
      if (!m) {
        throw new Error('"' + s + '" does not represent a valid decimal number');
      }
      return this.create({
        integralDigits: m[2],
        fractionDigits: m[3],
        positive: m[1] !== '-'
      });
    }

  }).augment({

    /**
     * @param {object} options (opional)
     *
     * @option options {string} integralDigits (default '0')
     *   the digits to the left of the period
     * @option options {string} fractionDigits (default '0')
     *   the digits to the right of the period
     * @option options {boolean} positive (default true)
     *   whether the decimal is positive
     */
    initialize: function (options) {
      options || (options = {});

      if (options.integralDigits) {
        this.integralDigits = options.integralDigits.replace(/^0+/, '') || '0';
      } else {
        this.integralDigits = '0';
      }
      if (options.fractionDigits) {
        this.fractionDigits = options.fractionDigits.replace(/0+$/, '');
      } else {
        this.fractionDigits = '';
      }
      if (util.isDefined(options.positive)) {
        if (this.integralDigits === '0' && !this.fractionDigits) {
          this.positive = true;
        } else {
          this.positive = options.positive;
        }
      } else {
        this.positive = true;
      }
    },

    /**
     * Convert the decimal to its canonical string representation.
     *
     * @return {string} the string representation
     */
    toString: function () {
      return (this.positive ? '' : '-') +
             this.integralDigits +
             '.' + (this.fractionDigits || '0');
    },

    /**
     * Get the number of total digits.
     *
     * @return {number}
     */
    countDigits: function () {
      return this.countIntegralDigits() + this.countFractionDigits();
    },

    /**
     * Get the number of digits to the left of the period.
     *
     * @return {number}
     */
    countIntegralDigits: function () {
      return this.integralDigits.length;
    },

    /**
     * Get the number of digits to the right of the period.
     *
     * @return {number}
     */
    countFractionDigits: function () {
      return this.fractionDigits ? this.fractionDigits.length : 0;
    },

    /**
     * Compare with a decimal as RHS.
     *
     * @param {sulfur/schema/value/simple/decimal} other the RHS datetime
     *
     * @return {-1} if less than `other`
     * @return {0} if equal to `other`
     * @return {1} if greater than `other`
     */
    cmp: function (other) {
      if (!this.positive && other.positive) {
        return -1;
      }
      if (this.positive && !other.positive) {
        return 1;
      }
      if (this.integralDigits.length < other.integralDigits.length) {
        return this.positive ? -1 : 1;
      }
      if (this.integralDigits.length > other.integralDigits.length) {
        return this.positive ? 1 : -1;
      }
      if (this.integralDigits < other.integralDigits) {
        return this.positive ? -1 : 1;
      }
      if (this.integralDigits > other.integralDigits) {
        return this.positive ? 1 : -1;
      }
      if (this.fractionDigits < other.fractionDigits) {
        return this.positive ? -1 : 1;
      }
      if (this.fractionDigits > other.fractionDigits) {
        return this.positive ? 1 : -1;
      }
      return 0;
    }

  });

});
