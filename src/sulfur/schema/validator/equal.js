/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/factory'], function ($factory) {

  'use strict';

  return $factory.derive({

    /**
     * @param [any] value
     */
    initialize: function (value) {
      this._value = value;
    },

    /**
     * Check if a value is strictly equal to the expected value.
     *
     * @param [any] value
     *
     * @return [boolean] whether `value` is strictly equal to the expected value
     */
    validate: function (value) {
      return value === this._value;
    }

  });

});
