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
     * Initialize the validator with one or more validators.
     *
     * @param {array} validators an array of one or more validators
     *
     * @throw {Error} if no validator is given
     */
    initialize: function (validators) {
      if (validators.length === 0) {
        throw new Error("must specify at least one validator");
      }
      this._validators = validators;
    },

    /**
     * Check if a value satisfies any of the validators.
     *
     * @param {any} value
     * @param {array} errors (optional)
     *
     * @return {boolean} whether `value` satisfies any validator
     */
    validate: function (value, errors) {
      return this._validators.some(function (validator) {
        return validator.validate(value, errors);
      });
    }

  });

});
