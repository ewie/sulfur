/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/util/factory'], function (Factory) {

  'use strict';

  var $ = Factory.clone({

    /**
     * Check if a string represents a boolean literal.
     *
     * @param {string} s
     *
     * @return {boolean} whether the `s` represents a boolean literal or not
     */
    isValidLiteral: (function () {

      var LITERAL_PATTERN = /^[\x09\x0A\x0D\x20]*(?:true|false|1|0)[\x09\x0A\x0D\x20]*$/;

      return function (s) {
        return LITERAL_PATTERN.test(s);
      };

    }()),

    /**
     * Parse a string representing a boolean literal.
     *
     * @param {string} s
     *
     * @throw {Error} if `s` does not represent a boolean literal
     */
    parse: function (s) {
      if (!this.isValidLiteral(s)) {
        throw new Error('invalid boolean literal "' + s + '"');
      }
      var value = /true|1/.test(s);
      return this.create(value);
    }

  });

  $.augment({

    /**
     * Initialize with a boolean value.
     *
     * @param {boolean} value
     *
     * @throw {Error} if `value` is not boolean
     */
    initialize: function (value) {
      if (typeof value !== 'boolean') {
        throw new Error("must be initialized with a boolean value");
      }
      this._value = value;
    },

    /**
     * Get the boolean value.
     *
     * @return {boolean} the boolean value
     */
    getValue: function () {
      return this._value;
    },

    /**
     * Get the canonical string representation.
     *
     * @return {string} the canonical string representation
     */
    toString: function () {
      return this._value ? 'true' : 'false';
    },

    /**
     * Check this for equality with another boolean.
     *
     * @param {sulfur/schema/value/simple/boolean} other
     *
     * @return {boolean} whether this is equal to `other`
     */
    eq: function (other) {
      return this._value === other._value;
    }

  });

  return $;

});
