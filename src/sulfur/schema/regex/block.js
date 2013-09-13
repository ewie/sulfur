/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/factory',
  'sulfur/unicode'
], function ($factory, $unicode) {

  'use strict';

  function isUnsupportedUnicodeBlock(name) {
    return [
      'HighPrivateUseSurrogates',
      'HighSurrogates',
      'LowSurrogates'
    ].indexOf(name) !== -1;
  }

  /**
   * A multi character escape "\p" or "\P" using a Unicode Block name.
   */

  return $factory.derive({
    /**
     * @param [string] name the Unicode Block name
     * @param [boolean] positive (default true) whether to match the codepoints
     *   of that block or the inverse
     */
    initialize: function (name, positive) {
      if (!$unicode.isValidBlock(name)) {
        throw new Error("unknown Unicode block " + name);
      }
      if (isUnsupportedUnicodeBlock(name)) {
        throw new Error("unsupported Unicode block " + name);
      }
      this.name = name;
      this.positive = typeof positive === 'undefined' ? true : positive;
    }
  });

});
