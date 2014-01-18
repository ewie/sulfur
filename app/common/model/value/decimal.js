/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/value/simple/decimal',
  'sulfur/ui/model'
], function (DecimalValue, Model) {

  'use strict';

  return Model.clone({

    get valueType() { return DecimalValue },

    attributes: {
      value: { default: null }
    },

    _extract: function (value) {
      return { value: value.toString() };
    }

  }).augment({

    get valueType() { return this.factory.valueType },

    _validate: function (errors) {
      var value = this.get('value');
      if (value && !DecimalValue.isValidLiteral(value)) {
        errors.value = "must be a valid decimal number";
      }
    },

    validateWithType: function (type) {
      var value = this.object;
      var err = false;
      if (value) {
        var v = type.createValidator();
        var errors = [];
        var isValid = v.validate(value, errors);
        isValid || (err = errors.join('\n'));
      }
      this.updateExternalErrors({ value: err });
    },

    _construct: function () {
      var v = this.get('value');
      if (v && DecimalValue.isValidLiteral(v)) {
        return DecimalValue.parse(v);
      }
    }

  });

});
