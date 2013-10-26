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
      var allowedElements = primitive.allowedElements;

      allowedElements.toArray().forEach(function (allowedElement) {
        var name = allowedElement.name;
        if (!elements.getByName(name)) {
          throw new Error('expecting element with name "' + name + '"');
        }
      });

      elements.toArray().forEach(function (element) {
        var name = element.name;
        var allowedElement = allowedElements.getByName(name);
        if (!allowedElement) {
          throw new Error('unexpected element with name "' + name + '"');
        }
        if (!element.type.isRestrictionOf(allowedElement.type)) {
          throw new Error('element "' + name + '" is not a restriction of the corresponding primitive element');
        }
      });

      this._primitive = primitive;
      this._elements = elements;
    },

    get primitive() {
      return this._primitive;
    },

    get valueType() {
      return this.primitive.valueType;
    },

    get elements() {
      return this._elements;
    },

    isRestrictionOf: function (other) {
      if (PrimitiveType.prototype.isPrototypeOf(other)) {
        return this.primitive.isRestrictionOf(other);
      }
      if (this.factory.prototype.isPrototypeOf(other)) {
        var otherElements = other.elements;
        return this._primitive.isRestrictionOf(other.primitive) &&
          this.elements.toArray().every(function (element) {
            var otherElement = otherElements.getByName(element.name);
            return element.type.isRestrictionOf(otherElement.type);
          });
      }
    },

    createValidator: function () {
      var validators = [ PrototypeValidator.create(this.valueType.prototype) ];
      this.elements.toArray().reduce(function (validators, element) {
        var validator = PropertyValidator.create('value',
          element.type.createValidator(), [ element.name ]);
        validators.push(validator);
        return validators;
      }, validators);
      return AllValidator.create(validators);
    }

  });

});
