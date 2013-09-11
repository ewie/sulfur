/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/object'
], function ($object) {

  'use strict';

  return $object.derive({

    /**
     * Initialize the validator with a minimum and maximum length.
     *
     * @param [object] options
     *
     * @option options [number] max the maximum allowed length
     * @pption options [number] min (default 0) the minimum required length
     *
     * @throw [Error] if `min` > `max`
     */
    initialize: function (options) {
      options || (options = {});

      var min = options.min || 0;
      var max = options.max;

      if (min < 0) {
        throw new Error("`min` must be non-negative");
      }
      if (max < 0) {
        throw new Error("`max` must be non-negative");
      }
      if (min > max) {
        throw new Error("`min` must be less than or equal `max`");
      }

      this._min = min;
      this._max = max;
    },

    /**
     * Check if a value's length satisfies the range.
     *
     * @param [#length] value
     *
     * @return [boolean] whether the length is valid
     */
    validate: function (value) {
      if (value.length < this._min) {
        return false;
      }
      if (typeof this._max !== 'undefined' && value.length > this._max) {
        return false;
      }
      return true;
    }

  });

});
