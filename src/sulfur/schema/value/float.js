/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/schema/value/double'], function ($doubleValue) {

  'use strict';

  var $ = $doubleValue.clone({

    /**
     * Get the maximum finite value.
     *
     * @return [number]
     */
    getMaxValue: function () {
      return 3.4028234663852886E+38;
    }

  });

  $.augment({

    /**
     * Initialize the float with a value.
     *
     * @param [number] value (default 0)
     *
     * @throw [Error] if `value` is not a number
     * @throw [Error] if `value` is less than -(.getMaxValue())
     * @throw [Error] if `value` is greater than .getMaxValue()
     */
    initialize: (function () {

      return function (value) {
        $doubleValue.prototype.initialize.call(this, value);

        if (this.isFinite()) {
          if (value < -this.factory.getMaxValue()) {
            throw new Error("must not be less than " + -this.factory.getMaxValue());
          }
          if (value > this.factory.getMaxValue()) {
            throw new Error("must not be greater than " + this.factory.getMaxValue());
          }
        }
      };

    }())

  });

  return $;

});
