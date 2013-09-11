/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/object'], function ($object) {

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
  var DECIMAL_PATTERN = /^([+-])?([0-9]+)(?:\.([0-9]+))?$/;

  /**
   * A regular expression matching an integer literal with optional insignifcant
   * fraction digits (only zero digits).
   */
  var INTEGER_PATTERN = /^[+-]?[0-9]+(?:\.0+)?$/;

  var $decimal = $object.clone({

    /**
     * Parse a string representing a decimal value.
     *
     * @param [string] s the string representation
     *
     * @return [decimal] the parsed decimal
     *
     * @throw [Error] if the string represents no valid decimal
     */
    parse: function (s) {
      var m = DECIMAL_PATTERN.exec(s);
      if (!m) {
        throw new Error('"' + s + '" does not represent a valid decimal number');
      }
      return this.create({
        integralDigits: m[2],
        fractionDigits: m[3],
        positive: m[1] !== '-'
      });
    },

    /**
     * Parse a string representing an integer value (i.e. a decimal with no
     * significant fraction digits).
     *
     * @param [string] s the string representation
     *
     * @return [decimal] the parsed decimal
     *
     * @throw [Error] if the string represent no valid integer
     */
    parseInteger: function (s) {
      var d = this.parse(s);
      if (d.countFractionDigits()) {
        throw new Error('"' + s + '" is not an integer');
      }
      return d;
    },

    /**
     * Check if a string represents a valid decimal value.
     *
     * @param [string] s the string representation
     *
     * @return [boolean] whether the representation is valid
     */
    isDecimal: function (s) {
      return DECIMAL_PATTERN.test(s);
    },

    /**
     * Check if a string represents a valid integer value.
     *
     * @param [string] s the string representation
     *
     * @return [boolean] whether the representation is valid
     */
    isInteger: function (s) {
      return INTEGER_PATTERN.test(s);
    }

  });

  $decimal.augment({

    /**
     * @param [object] options
     *
     * @option options [string] integralDigits (default '0')
     *   the digits to the left of the period
     * @option options [string] fractionDigits (default '')
     *   the digits to the right of the period
     * @option options [boolean] positive (default true)
     *   whether the decimal is positive
     */
    initialize: function (options) {
      if (options && options.integralDigits) {
        this.integralDigits = options.integralDigits.replace(/^0+/, '') || '0';
      } else {
        this.integralDigits = '0';
      }
      if (options && options.fractionDigits) {
        this.fractionDigits = options.fractionDigits.replace(/0+$/, '');
      }
      if (options && options.hasOwnProperty('positive')) {
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
     * Convert the decimal to its string representation.
     *
     * @return [string] the string representation
     */
    toLiteral: function () {
      var s = '';
      if (!this.positive) {
        s += '-';
      }
      s += this.integralDigits;
      if (this.fractionDigits) {
        s += '.' + this.fractionDigits;
      }
      return s;
    },

    /**
     * Check if the decimal represents an integer (i.e. no fraction digits).
     *
     * @return [boolean] whether it's an integer
     */
    isInteger: function () {
      return this.countFractionDigits() === 0;
    },

    /**
     * Get the number of total digits.
     *
     * @return [number]
     */
    countDigits: function () {
      return this.countIntegralDigits() + this.countFractionDigits();
    },

    /**
     * Get the number of digits to the left of the period.
     *
     * @return [number]
     */
    countIntegralDigits: function () {
      return this.integralDigits.length;
    },

    /**
     * Get the number of digits to the right of the period.
     *
     * @return [number]
     */
    countFractionDigits: function () {
      return this.fractionDigits ? this.fractionDigits.length : 0;
    },

    cmp: function (other) {
      if (!this.positive && other.positive) {
        return -1;
      }
      if (this.positive && !other.positive) {
        return 1;
      }
      if (this.integralDigits < other.integralDigits) {
        return -1;
      }
      if (this.integralDigits > other.integralDigits) {
        return 1;
      }
      if (this.fractionDigits < other.fractionDigits) {
        return -1;
      }
      if (this.fractionDigits > other.fractionDigits) {
        return 1;
      }
      return 0;
    },

    /**
     * Check if equal to another decimal.
     *
     * @param [decimal] other
     *
     * @return [boolean] whether both decimals are equal
     */
    eq: function (other) {
      return this.cmp(other) === 0;
    },

    /**
     * Check if the decimal is less than another decimal.
     *
     * @param [decimal] other
     *
     * @return [boolean] whether the decimal is less than the other
     */
    lt: function (other) {
      return this.cmp(other) < 0;
    },

    /**
     * Check if the decimal is greater than another decimal.
     *
     * @param [decimal] other
     *
     * @return [boolean] whether the decimal is greater than the other
     */
    gt: function (other) {
      return this.cmp(other) > 0;
    },

    /**
     * Check if the decimal is less than or equal to another decimal.
     *
     * @param [decimal] other
     *
     * @return [boolean] whether the decimal is less than or equal to the other
     */
    gteq: function (other) {
      return !this.lt(other);
    },

    /**
     * Check if the decimal is greater than or equal to another decimal.
     *
     * @param [decimal] other
     *
     * @return [boolean] whether the decimal is greater than or equal to the other
     */
    lteq: function (other) {
      return !this.gt(other);
    }

  });

  return $decimal;

});