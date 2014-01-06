/*
 * Copyright (c) 2013, 2014, Erik Wienhold
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
  'sulfur/schema/value/list'
], function (
    Factory,
    AllValidator,
    EachValidator,
    MaximumValidator,
    MinimumValidator,
    PropertyValidator,
    ListValue
) {

  'use strict';

  return Factory.derive({

    initialize: function (element, options) {
      if (options) {
        var maxLength = options.maxLength;
        var minLength = options.minLength;
        if (maxLength && maxLength.isNegative) {
          throw new Error("expecting maxLength to be non-negative");
        }
        if (minLength && minLength.isNegative) {
          throw new Error("expecting minLength to be non-negative");
        }
        if (maxLength && minLength && maxLength.lt(minLength)) {
          throw new Error("expecting minLength and maxLength to be a non-empty range");
        }
        this._maxLength = maxLength;
        this._minLength = minLength;
      }
      this._element = element;
      this._valueType = ListValue.withItemValueType(element.type.valueType);
    },

    get valueType() { return this._valueType },

    get element() { return this._element },

    get maxLength() { return this._maxLength },

    get minLength() { return this._minLength },

    createValidator: function () {
      var validators = [
        PropertyValidator.create('toArray',
          EachValidator.create(this.element.type.createValidator()))
      ];
      if (this.maxLength) {
        validators.push(PropertyValidator.create('length',
          MaximumValidator.create(this.maxLength)));
      }
      if (this.minLength) {
        validators.push(PropertyValidator.create('length',
          MinimumValidator.create(this.minLength)));
      }
      return AllValidator.create(validators);
    }

  });

});
