/*
 * Copyright (c) 2013, 2014, Erik Wienhold
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

  function number2integer(n) {
    return DecimalValue.create({ integralDigits: n.toString(10) });
  }

  /**
   * Implemenation of XSD's decimal using regular strings for representation
   * and comparison.
   */

  var DecimalValue = NumericValue.clone({

    /**
     * Parse a string representing a decimal value.
     *
     * @param {string} s the string representation
     *
     * @return {decimal} the parsed decimal
     *
     * @throw {Error} if the string represents no valid decimal
     */
    parse: (function () {

      /**
       * A regular expression matching a decimal literal. Captures the
       * following groups:
       *
       *   $1 optional sign
       *   $2 integral digits
       *   $3 optional fraction digits
       */
      var pattern = /^[\x09\x0A\x0D\x20]*([+-])?([0-9]+)(?:\.([0-9]+))?[\x09\x0A\x0D\x20]*$/;

      return function (s) {
        var m = pattern.exec(s);
        if (!m) {
          throw new Error('"' + s + '" does not represent a valid decimal number');
        }
        return this.create({
          integralDigits: m[2],
          fractionDigits: m[3],
          positive: m[1] !== '-'
        });
      };

    }())

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
        this._integralDigits = options.integralDigits.replace(/^0+/, '') || '0';
      } else {
        this._integralDigits = '0';
      }
      if (options.fractionDigits) {
        this._fractionDigits = options.fractionDigits.replace(/0+$/, '');
      } else {
        this._fractionDigits = '';
      }
      if (this._integralDigits === '0' && !this._fractionDigits) {
        this._positive = undefined;
      } else if (util.isDefined(options.positive)) {
        this._positive = !!options.positive;
      } else {
        this._positive = true;
      }
    },

    /**
     * Convert the decimal to its canonical string representation.
     *
     * @return {string} the string representation
     */
    toString: function () {
      return (this.isNegative ? '-' : '') +
             this.integralDigits +
             '.' + (this.fractionDigits || '0');
    },

    /**
     * @return {true} when positive
     * @return {false} when zero
     * @return {false} when negative
     */
    get isPositive() { return this._positive },

    /**
     * @return {true} when negative
     * @return {false} when zero
     * @return {false} when positive
     */
    get isNegative() {
      return typeof this.isPositive === 'undefined' ? undefined : !this.isPositive;
    },

    /** @return {string} the integral digits */
    get integralDigits() { return this._integralDigits },

    /** @return {string} the fraction digits */
    get fractionDigits() { return this._fractionDigits },

    /**
     * Get the number of total digits.
     *
     * @return {sulfur/schema/value/simple/decimal}
     */
    countDigits: function () {
      return number2integer(this.integralDigits.length + this.fractionDigits.length);
    },

    /**
     * Get the number of digits to the left of the period.
     *
     * @return {sulfur/schema/value/simple/decimal}
     */
    countIntegralDigits: function () {
      return number2integer(this.integralDigits.length);
    },

    /**
     * Get the number of digits to the right of the period.
     *
     * @return {sulfur/schema/value/simple/decimal}
     */
    countFractionDigits: function () {
      return this.fractionDigits ?
        number2integer(this.fractionDigits.length) :
        DecimalValue.create();
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
      if (this.isNegative && !other.isNegative) {
        return -1;
      }
      if (this.isPositive && !other.isPositive) {
        return 1;
      }
      if (!this.isNegative && other.isNegative) {
        return 1;
      }
      if (!this.isPositive && other.isPositive) {
        return -1;
      }
      if (this.integralDigits.length < other.integralDigits.length) {
        return this.isNegative ? 1 : -1;
      }
      if (this.integralDigits.length > other.integralDigits.length) {
        return this.isNegative ? -1 : 1;
      }
      if (this.integralDigits < other.integralDigits) {
        return this.isNegative ? 1 : -1;
      }
      if (this.integralDigits > other.integralDigits) {
        return this.isNegative ? -1 : 1;
      }
      if (this.fractionDigits < other.fractionDigits) {
        return this.isNegative ? 1 : -1;
      }
      if (this.fractionDigits > other.fractionDigits) {
        return this.isNegative ? -1 : 1;
      }
      return 0;
    }

  });

  return DecimalValue;

});
