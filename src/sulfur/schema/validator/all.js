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
     * Initialize the validator with zero or more validators.
     *
     * @param [array] validators an array of zero or more validators
     */
    initialize: function (validators) {
      this._validators = validators;
    },

    /**
     * Validate a value against all validators.
     *
     * @param [any] value
     *
     * @return [boolean] whether `value` passes all validators or not
     */
    validate: function (value) {
      return this._validators.every(function (validator) {
        return validator.validate(value);
      });
    }

  });

});