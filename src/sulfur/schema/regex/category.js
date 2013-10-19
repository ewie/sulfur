/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/util/factory',
  'sulfur/util/unicode'
], function (Factory, unicode) {

  'use strict';

  function isUnsupportedUnicodeCategory(name) {
    // category `Cn` is not supported by the DataGridService (which uses .Net)
    return name === 'Cn';
  }

  /**
   * A multi character escape "\p" or "\P" using the name of a Unicode General
   * Category or Group.
   */

  return Factory.derive({
    /**
     * @param {string} name the name of a Unicode General Category or Group
     * @param {boolean} positive (default true) whether to match the codepoints
     *   of that General Category or the inverse
     */
    initialize: function (name, positive) {
      if (isUnsupportedUnicodeCategory(name)) {
        throw new Error("unsupported Unicode category " + name);
      }
      if (!unicode.isValidCategory(name) && !unicode.isValidCategoryGroup(name)) {
        throw new Error("unknown Unicode category " + name);
      }
      this.name = name;
      this.positive = typeof positive === 'undefined' ? true : positive;
    }
  });

});
