/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/factory'], function (Factory) {

  'use strict';

  return Factory.derive({

    /**
     * Initialize the validator with a property name and subvalidator.
     *
     * @param [string] name
     * @param [#validate()] validator a validator for the named property
     */
    initialize: function (name, validator) {
      this._name = name;
      this._validator = validator;
    },

    /**
     * Validate an object's property against the subvalidator if that property
     * is not undefined.
     *
     * @param [object] obj
     *
     * @return [true] if the property is undefined or satisfies the subvalidator
     * @return [false] if the property does not satisfy the subvalidator
     */
    validate: function (value) {
      value = value[this._name];
      if (typeof value === 'undefined') {
        return true;
      }
      if (typeof value === 'function') {
        value = value();
      }
      return this._validator.validate(value);
    }

  });

});
