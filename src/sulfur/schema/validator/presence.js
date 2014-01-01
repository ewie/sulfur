/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/util/factory'], function (Factory) {

  'use strict';

  return Factory.derive({

    /**
     * Initialize the validator with a subvalidator.
     *
     * @param {.validate()} validator a validator for any given value
     */
    initialize: function (validator) {
      this._validator = validator;
    },

    /**
     * Validate a value using the subvalidator if that value is defined.
     *
     * @param {any} value
     *
     * @return {true} when the value is undefined or satisfies the subvalidator
     * @return {false} when the value does not satisfy the subvalidator
     */
    validate: function (value) {
      return typeof value === 'undefined' || this._validator.validate(value);
    }

  });

});
