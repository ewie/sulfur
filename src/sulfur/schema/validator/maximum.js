/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/factory'], function (Factory) {

  'use strict';

  return Factory.derive({

    /**
     * @param [any] maximum
     * @param [object] options (optional)
     *
     * @option options [boolean] exclusive whether to match exclusively or not
     */
    initialize: function (maximum, options) {
      options || (options = {});
      this._maximum = maximum;
      this._exclusive = options.exclusive;
    },

    /**
     * Check if a value satisfies the maximum. If minimum responds to #cmp(),
     * it will be called with `value` as argument, otherwise uses the regular
     * comparison operator.
     *
     * @param [any] value
     *
     * @return [boolean] whether `value` is less than maximum or equal when
     *   matched inclusively
     */
    validate: function (value) {
      var x, y;
      if (typeof this._maximum.cmp === 'function') {
        x = 0;
        y = this._maximum.cmp(value);
      } else {
        x = value;
        y = this._maximum;
      }
      return x < y || y === x && !this._exclusive;
    }

  });

});
