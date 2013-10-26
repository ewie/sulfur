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
      if (options) {
        this._maxLength = options.maxLength;
        this._minLength = options.minLength;
      }
    },

    get element() {
      return this._element;
    },

    get maxLength() {
      return this._maxLength;
    },

    get minLength() {
      return this._minLength;
    },

    createValidator: function () {
      var validators = [
        PropertyValidator.create('toArray',
          EachValidator.create(this.element.type.createValidator()))
      ];
      if (util.isDefined(this.maxLength)) {
        validators.push(PropertyValidator.create('length',
          MaximumValidator.create(this.maxLength)));
      }
      if (util.isDefined(this.minLength)) {
        validators.push(PropertyValidator.create('length',
          MinimumValidator.create(this.minLength)));
      }
      return AllValidator.create(validators);
    }

  });

});
