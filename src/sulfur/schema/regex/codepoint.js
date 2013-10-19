/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/factory',
  'sulfur/unicode'
], function (Factory, Unicode) {

  'use strict';

  /**
   * Test if a codepoint value is a valid XML character.
   *
   * @param {number} value the codepoint value
   *
   * @return {true} if valid
   * @return {false} otherwise
   */
  function isValidXmlCharacterCodepoint(value) {
    return value === 0x9 ||
           value === 0xA ||
           value === 0xD ||
           value >= 0x20 && value <= 0xD7FF ||
           value >= 0xE000 && value <= 0xFFFD ||
           value >= 0x10000 && value <= 0x10FFFF;
  }

  /**
   * A codepoint represents a valid XML character using its UCS codepoint value.
   */

  return Factory.derive({
    /**
     * @param {number|string} value a valid XML character
     *   either as UCS codepoint in the range U+0000..U+10FFFF, or as string
     *   containing a single BMP codepoint or a surrogate pair
     *
     * @throw {Error} if the string is empty
     * @throw {Error} if the string contains more than one character
     */
    initialize: function (value) {
      if (typeof value !== 'number') {
        if (!value) {
          throw new Error("expecting a string with exactly one character");
        }
        var pair = Unicode.decodeCharacterFromUtf16(value);
        if (value.length > pair[1]) {
          throw new Error("expecting a string with exactly one character");
        }
        value = pair[0];
      }
      if (!isValidXmlCharacterCodepoint(value)) {
        throw new Error("expecting a valid XML character");
      }
      this.value = value;
    }
  });

});
