/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/factory'
], function ($factory) {

  'use strict';

  return $factory.derive({

    /**
     * Initialize the validator with an object responding to #test(). This
     * allows the use of a `RegExp` or `sulfur/schema/pattern`.
     *
     * @param [#test()] pattern
     */
    initialize: function (pattern) {
      this._pattern = pattern;
    },

    /**
     * Check if a string satisfies the pattern.
     *
     * @param [string] value
     *
     * @return [boolean] whether `value` satisfies the pattern
     */
    validate: function (value) {
      return this._pattern.test(value);
    }

  });

});
