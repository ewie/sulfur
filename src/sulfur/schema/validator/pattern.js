/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/util/factory'], function (Factory) {

  'use strict';

  return Factory.derive({

    /**
     * Initialize the validator with an object responding to .test(). This
     * allows the use of a {RegExp} or {sulfur/schema/value/simple/pattern}.
     *
     * @param {.test()} pattern
     */
    initialize: function (pattern) {
      this._pattern = pattern;
    },

    /**
     * Check if a value's string representation satisfies the pattern.
     *
     * @param {.toString()} value
     *
     * @return {boolean} whether the string representation of `value` satisfies
     *   the pattern
     */
    validate: function (value) {
      return this._pattern.test(value.toString());
    }

  });

});
