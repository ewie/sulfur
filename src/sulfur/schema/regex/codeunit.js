/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/object'
], function ($object) {

  'use strict';

  /**
   * A codeunit represents any codepoint from the BMP (including surrogates).
   * Codeunits are used to represent UTF-16 encoded characters.
   */

  return $object.derive({
    /**
     * @param [number] value the codeunit value in the range U+0000..U+FFFF
     *
     * @throw [Error] if `value` is outside the valid range
     */
    initialize: function (value) {
      if (value < 0 || value > 0xFFFF) {
        throw new Error("codeunit value must be a 16-bit integer");
      }
      this.value = value;
    }
  });

});
