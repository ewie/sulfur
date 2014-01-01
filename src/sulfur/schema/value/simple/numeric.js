/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/schema/value/simple'], function (SimpleValue) {

  'use strict';

  /**
   * @abstract
   *
   * @implement {boolean} #cmp({sulfur/schema/value/simple/numeric})
   */
  return SimpleValue.derive({

    /**
     * Check if this value is equal to the other value.
     *
     * @return {true} when equal
     * @return {false} when not equal
     */
    eq: function (other) { return this.cmp(other) === 0 },

    /**
     * Check if this value is less than the other value.
     *
     * @return {true} when less
     * @return {false} when not less
     */
    lt: function (other) { return this.cmp(other) < 0 },

    /**
     * Check if this value is greater than the other value.
     *
     * @return {true} when greater
     * @return {false} when not greater
     */
    gt: function (other) { return this.cmp(other) > 0 },

    /**
     * Check if this value is less than or equal to the other value.
     *
     * @return {true} when less or equal
     * @return {false} when not less
     */
    lteq: function (other) { return !this.gt(other) },

    /**
     * Check if this value is greater than or equal to the other value.
     *
     * @return {true} when greater or equal
     * @return {false} when not greater
     */
    gteq: function (other) { return !this.lt(other) }

  });

});
