/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/value/_simple',
  'sulfur/util',
  'unorm'
], function ($_simpleValue, $util, $unorm) {

  'use strict';

  var $ = $_simpleValue.clone({

    /**
     * Check if a string contains only valid codeunits.
     *
     * @param [string] s
     *
     * @return [boolean] whether `s` contains only valid codeunits or not
     */
    isValidLiteral: (function () {

      var LITERAL_PATTERN = /^(?:[\x09\x0A\x0D\x20-\uD7FF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uE000-\uFFFD])*$/;

      return function (s) {
        return LITERAL_PATTERN.test(s);
      };

    }())

  });

  $.augment({

    /**
     * Initialize with a string value.
     *
     * @param [string] value
     *
     * @throw [Error] if `value` is not a string
     * @throw [Error] if `value` does not satisfy .isValidLiteral()
     */
    initialize: function (value) {
      $util.isUndefined(value) && (value = '');

      if (typeof value !== 'string') {
        throw new Error("must be initialized with a string value");
      }

      if (!this.factory.isValidLiteral(value)) {
        throw new Error("invalid string value");
      }

      this._value = $unorm.nfc(value);
    },

    /**
     * Get the string value.
     *
     * @return [string]
     */
    toString: function () {
      return this._value;
    },

    /**
     * Get the number of codeunits.
     *
     * @return [number]
     */
    getLength: function () {
      return this._value.length;
    },

    /**
     * Check this for equality with another string.
     *
     * @param [sulfur/schema/value/string] other
     *
     * @return [boolean] whether this and `other` are equal or not
     */
    eq: function (other) {
      return this._value === other._value;
    }

  });

  return $;

});
