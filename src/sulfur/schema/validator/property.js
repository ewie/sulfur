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
     * @param [array] arguments (default []) arguments to be passed to the
     *   property when it's a function
     */
    initialize: function (name, validator, args) {
      this._name = name;
      this._validator = validator;
      this._arguments = args;
    },

    getPropertyName: function () {
      return this._name;
    },

    getArguments: function () {
      return this._arguments;
    },

    getValidator: function () {
      return this._validator;
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
        property = property.apply(obj, this._arguments);
      }
      return this._validator.validate(property);
    }

  });

});
