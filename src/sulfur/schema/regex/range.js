/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/util/factory'
], function (Factory) {

  'use strict';

  /**
   * A range represents a non-empty interval of codepoints.
   */

  return Factory.derive({
    /**
     * @param {codepoint|codeunit} start the first value in the range
     * @param {codepoint|codeunit} end the last value in the range
     *
     * @throw {Error} if the range is empty
     */
    initialize: function (start, end) {
      if (start.value > end.value) {
        throw new Error(
          "empty range 0x" + start.value.toString(16) + ", 0x" + end.value.toString(16));
      }
      this.start = start;
      this.end = end;
    }
  });

});
