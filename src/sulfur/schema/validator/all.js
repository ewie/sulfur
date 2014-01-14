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
     * Initialize the validator with zero or more validators.
     *
     * @param {array} validators an array of zero or more validators
     */
    initialize: function (validators) {
      this._validators = validators;
    },

    /**
     * @return {array} the validators
     */
    get validators() { return this._validators },

    /**
     * Validate a value against all validators.
     *
     * @param {any} value
     * @param {array} errors (optional)
     *
     * @return {boolean} whether `value` passes all validators or not
     */
    validate: function (value, errors) {
      return this.validators.every(function (validator) {
        return validator.validate(value, errors);
      });
    }

  });

});
