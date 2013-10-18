/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/factory',
  'sulfur/schema/validator/all',
  'sulfur/schema/validator/property',
  'sulfur/schema/validator/prototype'
], function ($factory, $allValidator, $propertyValidator, $prototypeValidator) {

  'use strict';

  return $factory.derive({

    initialize: function (options) {
      this._qname = options.qname;
      this._namespace = options.namespace;
      this._valueType = options.valueType;
      this._allowedElements = options.elements;
    },

    getQName: function () {
      return this._qname;
    },

    getValueType: function () {
      return this._valueType;
    },

    getAllowedElements: function () {
      return this._allowedElements;
    },

    createValidator: function () {
      var validators = [ $prototypeValidator.create(this._valueType.prototype) ];
      this._allowedElements.toArray().reduce(function (validators, element) {
        var validator = $propertyValidator.create('getValue',
          element.getType().createValidator(), [ element.getName() ]);
        validators.push(validator);
        return validators;
      }, validators);
      return $allValidator.create(validators);
    }

  });

});
