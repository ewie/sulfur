/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/factory'
], function ($factory) {

  'use strict';

  return $factory.derive({

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
     * Validate an object's property against the subvalidator.
     *
     * @param [object] obj
     *
     * @return [boolean] whether the property of `obj` satisfies the subvalidator
     */
    validate: function (obj) {
      var property = obj[this._name];
      if (typeof property === 'function') {
        property = property.call(obj);
      }
      return this._validator.validate(property);
    }

  });

});
