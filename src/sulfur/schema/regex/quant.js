/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/factory'
], function (Factory) {

  'use strict';

  /**
   * A quantifier specifies the minimum and maximum number of an atom's
   * occurrences. The maximum may be unlimited.
   */

  return Factory.derive({
    /**
     * @param [number] min
     * @param [number] max (default `min`) use Number.POSITIVE_INFINITY for an
     *   unlimited number of occurrences
     *
     * @throw [Error] if `min` is less than zero
     * @throw [Error] if `min` is greater than `max`
     */
    initialize: function (min, max) {
      if (min < 0) {
        throw new Error("minimum must not be negative");
      }
      if (min > max) {
        throw new Error("maximum must not be less than minimum");
      }
      this.min = min;
      this.max = max || min;
    }
  });

});
