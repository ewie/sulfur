/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/type/complex/primitive',
  'sulfur/schema/validator/all',
  'sulfur/schema/validator/property',
  'sulfur/schema/validator/prototype',
  'sulfur/util/factory'
], function (
    PrimitiveType,
    AllValidator,
    PropertyValidator,
    PrototypeValidator,
    Factory
) {

  'use strict';

  return Factory.derive({

    initialize: function (primitive, elements) {
      var allowedElements = primitive.getAllowedElements();

      allowedElements.toArray().forEach(function (allowedElement) {
        var name = allowedElement.getName();
        if (!elements.getElement(name)) {
          throw new Error('expecting element with name "' + name + '"');
        }
      });

      elements.toArray().forEach(function (element) {
        var name = element.getName();
        var allowedElement = allowedElements.getElement(name);
        if (!allowedElement) {
          throw new Error('unexpected element with name "' + name + '"');
        }
        if (!element.getType().isRestrictionOf(allowedElement.getType())) {
          throw new Error('element "' + name + '" is not a restriction of the corresponding primitive element');
        }
      });

      this._primitive = primitive;
      this._elements = elements;
    },

    getPrimitive: function () {
      return this._primitive;
    },

    getValueType: function () {
      return this._primitive.getValueType();
    },

    getElements: function () {
      return this._elements;
    },

    isRestrictionOf: function (other) {
      if (PrimitiveType.prototype.isPrototypeOf(other)) {
        return this._primitive.isRestrictionOf(other);
      }
      if (this.factory.prototype.isPrototypeOf(other)) {
        var otherElements = other.getElements();
        return this._primitive.isRestrictionOf(other.getPrimitive()) &&
          this._elements.toArray().every(function (element) {
            var otherElement = otherElements.getElement(element.getName());
            return element.getType().isRestrictionOf(otherElement.getType());
          });
      }
    },

    createValidator: function () {
      var validators = [ PrototypeValidator.create(this.getValueType().prototype) ];
      this._elements.toArray().reduce(function (validators, element) {
        var validator = PropertyValidator.create('getValue',
          element.getType().createValidator(), [ element.getName() ]);
        validators.push(validator);
        return validators;
      }, validators);
      return AllValidator.create(validators);
    }

  });

});
