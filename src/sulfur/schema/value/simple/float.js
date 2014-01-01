/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/schema/value/simple/double'], function (DoubleValue) {

  'use strict';

  return DoubleValue.clone({

    /**
     * Get the maximum finite value.
     *
     * @return {number}
     */
    get maxValue() {
      return 3.4028234663852886E+38;
    }

  }).augment({

    /**
     * Initialize the float with a value.
     *
     * @param {number} value (default 0)
     *
     * @throw {Error} if `value` is not a number
     * @throw {Error} if `value` is less than -(.maxValue)
     * @throw {Error} if `value` is greater than .maxValue
     */
    initialize: (function () {

      return function (value) {
        DoubleValue.prototype.initialize.call(this, value);

        if (this.isFinite()) {
          if (value < -this.factory.maxValue) {
            throw new Error("must not be less than " + -this.factory.maxValue);
          }
          if (value > this.factory.maxValue) {
            throw new Error("must not be greater than " + this.factory.maxValue);
          }
        }
      };

    }())

  });

});
