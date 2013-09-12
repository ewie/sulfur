/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/object'], function ($object) {

  'use strict';

  return $object.derive({

    /**
     * @param [any] minimum
     * @param [object] options (optional)
     *
     * @option options [boolean] exclusive whether to match exclusivelly or not
     */
    initialize: function (minimum, options) {
      options || (options = {});
      this._minimum = minimum;
      this._exclusive = options.exclusive;
    },

    /**
     * Check if a value satisfies the minimum. If minimum responds to #cmp(),
     * it will be called with `value` as argument, otherwise uses the regular
     * comparison operator.
     *
     * @param [any] value
     *
     * @return [boolean] whether `value` is greater than minimum or equal when
     *   matched inclusivelly
     */
    validate: function (value) {
      var x, y;
      if (typeof this._minimum.cmp === 'function') {
        x = 0;
        y = this._minimum.cmp(value);
      } else {
        x = value;
        y = this._minimum;
      }
      return x > y || y === x && !this._exclusive;
    }

  });

});