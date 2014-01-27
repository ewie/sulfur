/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/value/simple/string',
  'sulfur/ui/model',
  'unorm'
], function (StringValue, Model, unorm) {

  'use strict';

  return Model.clone({

    get valueType() { return StringValue },

    attributes: {
      value: { default: '' }
    },

    _extract: function (value) {
      return { value: value.toString() };
    }

  }).augment({

    get valueType() { return this.factory.valueType },

    _validate: function (errors) {
      var value = this.get('value');
      if (value && !StringValue.isValidLiteral(value)) {
        errors.value = "must be a string of XML characters";
      }
    },

    validateWithType: function (type) {
      if (this.isInternallyValid()) {
        var value = this.object;
        var err = false;
        if (value) {
          var v = type.createValidator();
          var errors = [];
          var isValid = v.validate(value, errors);
          isValid || (err = errors.join('\n'));
        }
        this.updateExternalErrors({ value: err });
      }
    },

    _construct: function () {
      var v = this.get('value');
      if (v && StringValue.isValidLiteral(v)) {
        var s = unorm.nfc(this.get('value'));
        return StringValue.create(s);
      }
    }

  });

});
