/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/schema/value/simple'], function (SimpleValue) {

  'use strict';

  return SimpleValue.clone({

    /**
     * Parse a string representing a boolean literal.
     *
     * @param {string} s
     *
     * @throw {Error} if `s` does not represent a boolean literal
     */
    parse: (function () {

      var pattern = /^[\x09\x0A\x0D\x20]*(?:true|false|1|0)[\x09\x0A\x0D\x20]*$/;

      return function (s) {
        if (!pattern.test(s)) {
          throw new Error('invalid boolean literal "' + s + '"');
        }
        return this.create(/true|1/.test(s));
      };

    }())

  }).augment({

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
    get value() {
      return this._value;
    },

    /**
     * Get the canonical string representation.
     *
     * @return {string} the canonical string representation
     */
    toString: function () {
      return this.value ? 'true' : 'false';
    },

    /**
     * Check this for equality with another boolean.
     *
     * @param {sulfur/schema/value/simple/boolean} other
     *
     * @return {boolean} whether this is equal to `other`
     */
    eq: function (other) {
      return this.value === other.value;
    }

  });

});
