/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/validator/all',
  'sulfur/schema/validator/property',
  'sulfur/schema/validator/prototype',
  'sulfur/util/factory'
], function (AllValidator, PropertyValidator, PrototypeValidator, Factory) {

  'use strict';

  return Factory.derive({

    initialize: function (options) {
      this._qname = options.qname;
      this._namespace = options.namespace;
      this._valueType = options.valueType;
      this._allowedElements = options.elements;
    },

    get qname() {
      return this._qname;
    },

    get valueType() {
      return this._valueType;
    },

    get allowedElements() {
      return this._allowedElements;
    },

    isRestrictionOf: function (other) {
      return this === other;
    },

    createValidator: function () {
      var validators = [ PrototypeValidator.create(this.valueType.prototype) ];
      this.allowedElements.toArray().reduce(function (validators, element) {
        var validator = PropertyValidator.create('value',
          element.type.createValidator(), [ element.name ]);
        validators.push(validator);
        return validators;
      }, validators);
      return AllValidator.create(validators);
    }

  });

});
