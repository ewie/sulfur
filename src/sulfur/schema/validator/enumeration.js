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
     * Initialize the validator with one or more allowed values.
     *
     * @param [array] values
     */
    initialize: function (values) {
      if (values.length === 0) {
        throw new Error("must specify at least one value");
      }
      this._values = values;
    },

    /**
     * Validate a value against all allowed values.
     *
     * @param [any] value
     *
     * @return [boolean] whether `value` strictly equals one of the allowed
     *   values
     */
    validate: function (value) {
      var fn;
      if (typeof value.cmp === 'function') {
        fn = function (validValue) { return value.cmp(validValue) === 0; };
      } else {
        fn = function (validValue) { return validValue === value; };
      }
      return this._values.some(fn);
    }

  });

});
