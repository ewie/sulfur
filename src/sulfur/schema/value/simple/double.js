/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/schema/value/simple/numeric'], function (NumericValue) {

  'use strict';

  return NumericValue.clone({

    /**
     * Get the maximum finite value.
     *
     * @return {number}
     */
    get maxValue() {
      return 1.7976931348623157e+308;
    },

    /**
     * Check if a string represents a valid float literal.
     *
     * @param {string} s the string to check
     *
     * @return {boolean} whether the string represents a float in the valid
     *   range or not
     */
    isValidLiteral: function (s) {
      try {
        this.parse(s);
      } catch (_) {
        return false;
      }
      return true;
    },

    /**
     * Parse a string representing a float literal.
     *
     * @param {string} s the string to parse
     *
     * @return {sulfur/schema/value/simple/double} a float with the parsed value
     *
     * @throw {Error} if the literal has syntax errors
     * @throw {Error} if the literal value lies outside the valid range
     */
    parse: (function () {

      var LITERAL_PATTERN = /^[\x09\x0A\x0D\x20]*(?:NaN|-?INF|[+-]?[0-9]+(?:\.[0-9]+)?(?:[Ee][+-]?[0-9]+)?)[\x09\x0A\x0D\x20]*$/;

      return function (s) {
        if (!LITERAL_PATTERN.test(s)) {
          throw new Error('invalid literal "' + s + '"');
        }
        switch (s) {
        case 'NaN':
          return this.create(Number.NaN);
        case 'INF':
          return this.create(Number.POSITIVE_INFINITY);
        case '-INF':
          return this.create(Number.NEGATIVE_INFINITY);
        default:
          var value = parseFloat(s);

          // A syntactical valid literal representing a finite value may
          // evaluate to +/- infinity if it lies outside the range of double
          // values.
          if (value < -this.maxValue) {
            throw new Error("must not be less than " + -this.maxValue);
          } else if (value > this.maxValue) {
            throw new Error("must not be greater than " + this.maxValue);
          }

          return this.create(value);
        }
      };

    }())

  }).augment({

    /**
     * Initialize the float with a value.
     *
     * @param {number} value (default 0)
     *
     * @throw {Error} if `value` is not a number
     */
    initialize: function (value) {
      typeof value === 'undefined' && (value = 0);
      if (typeof value !== 'number') {
        throw new Error("must be initialized with a proper number");
      }
      this._value = value;
    },

    /**
     * Get the represented value.
     *
     * @return {number}
     */
    get value() {
      return this._value;
    },

    /**
     * Check if the value is finite.
     *
     * @return {boolean} whether the value is finite or not
     */
    isFinite: (function () {

      // ECMAScript 6 introduces `Number.isFinite` which may not be available on a
      // browser so fall back to the global `isFinite`.
      var _isFinite = Number.isFinite || isFinite;

      return function () {
        return _isFinite(this.value);
      };

    }()),

    /**
     * Check if the value is NaN (not a number).
     *
     * @return {boolean} whether the value is NaN or not
     */
    isNaN: (function () {
      // ECMAScript 6 introduces `Number.isNaN` which may not be available on a
      // browser so fall back to the global `isNaN`.
      var _isNaN = Number.isNaN || isNaN;

      return function () {
        return _isNaN(this.value);
      };

    }()),

    /**
     * Check if the value is positive (not zero not negative).
     *
     * @return {boolean} whether the value is positive or not
     */
    isPositive: function () {
      return this.value > 0;
    },

    /**
     * Get the value's canonical representation.
     *
     * @return {string} the canonical representation
     */
    toString: function () {
      if (this.value === 0) {
        return '0.0E0';
      }
      return this.value.toExponential().replace(/e\+?/, 'E');
    },

    /**
     * Compare this float as LHS with another float as RHS.
     *
     * @param {sulfur/schema/value/simple/double} other
     *
     * @return {-1} if LHS is less than RHS
     * @return {0} if LHS is equal to RHS
     * @return {1} if LHS is greater than RHS
     * @return {undefined} if either LHS or RHS is NaN
     */
    cmp: function (other) {
      if (this.value < other.value) {
        return -1;
      }
      if (this.value > other.value) {
        return 1;
      }
      if (this.isNaN() ^ other.isNaN()) {
        return undefined;
      }
      return 0;
    }

  });

});
