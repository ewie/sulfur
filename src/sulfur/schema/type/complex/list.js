/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/util/factory',
  'sulfur/schema/validator/all',
  'sulfur/schema/validator/each',
  'sulfur/schema/validator/maximum',
  'sulfur/schema/validator/minimum',
  'sulfur/schema/validator/property',
  'sulfur/util'
], function (
    Factory,
    AllValidator,
    EachValidator,
    MaximumValidator,
    MinimumValidator,
    PropertyValidator,
    util
) {

  'use strict';

  return Factory.derive({

    initialize: function (element, options) {
      this._element = element;
      this._maxLength = options && options.maxLength;
      this._minLength = options && options.minLength;
    },

    getElement: function () {
      return this._element;
    },

    getMaxLength: function () {
      return this._maxLength;
    },

    getMinLength: function () {
      return this._minLength;
    },

    createValidator: function () {
      var validators = [
        PropertyValidator.create('toArray',
          EachValidator.create(this._element.getType().createValidator()))
      ];
      if (util.isDefined(this._maxLength)) {
        validators.push(PropertyValidator.create('getLength',
          MaximumValidator.create(this._maxLength)));
      }
      if (util.isDefined(this._minLength)) {
        validators.push(PropertyValidator.create('getLength',
          MinimumValidator.create(this._minLength)));
      }
      return AllValidator.create(validators);
    }

  });

});
