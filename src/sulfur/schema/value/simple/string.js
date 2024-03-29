/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/value/simple',
  'sulfur/schema/value/simple/integer',
  'sulfur/util'
], function (SimpleValue, IntegerValue, util) {

  'use strict';

  var pattern = /^(?:[\x09\x0A\x0D\x20-\uD7FF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uE000-\uFFFD])*$/;

  return SimpleValue.clone({

    /**
     * Parse a string value.
     *
     * @param {string} s
     *
     * @return {sulfur/schema/value/simple/string} the parsed string value
     */
    parse: function (s) {
      return this.create(s);
    }

  }).augment({

    /**
     * Initialize with a string value.
     *
     * @param {string} value
     *
     * @throw {Error} if `value` is not a string
     */
    initialize: function (value) {
      util.isUndefined(value) && (value = '');

      if (typeof value !== 'string') {
        throw new Error("must be initialized with a string value");
      }

      if (!pattern.test(value)) {
        throw new Error("invalid string value");
      }

      this._value = value;
    },

    /**
     * Get the string value.
     *
     * @return {string}
     */
    toString: function () {
      return this._value;
    },

    /**
     * Get the number of codeunits.
     *
     * @return {number}
     */
    get length() {
      return IntegerValue.createFromNumber(this._value.length);
    },

    /**
     * @param {string} mode the normalization mode ("collapse", "preserve" or "replace")
     *
     * @return {sulfur/schema/value/simple/string} a string with normalized white space
     *
     * @throw {Error} when an invalid normalization mode is given
     */
    normalizeWhiteSpace: function (mode) {
      switch (mode) {
      case 'collapse':
        return this.collapseWhiteSpace();
      case 'preserve':
        return this;
      case 'replace':
        return this.replaceWhiteSpace();
      default:
        throw new Error('unexpected normalization mode "' + mode + '", ' +
          'expecting either "collapse", "preserve" or "replace"');
      }
    },

    /**
     * Replace every sequence of white space characters with a single space,
     * and remove leading and trailing white space.
     *
     * @return {sulfur/schema/value/simple/string} a string with collapsed white space
     */
    collapseWhiteSpace: function () {
      var s = this._value.replace(/[\x09\x0A\x0D\x20]+/g, ' ')
        .replace(/^\x20|\x20$/g, '');
      return this.factory.create(s);
    },

    /**
     * Replace every white space character with a single space.
     *
     * @return {sulfur/schema/value/simple/string} a string with replaced white space
     */
    replaceWhiteSpace: function () {
      var s = this._value.replace(/[\x09\x0A\x0D\x20]/g, ' ');
      return this.factory.create(s);
    },

    /**
     * Check this for equality with another string.
     *
     * @param {sulfur/schema/value/simple/string} other
     *
     * @return {boolean} whether this and `other` are equal or not
     */
    eq: function (other) {
      return this._value === other._value;
    }

  });

});
