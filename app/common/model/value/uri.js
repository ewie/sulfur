/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/value/simple/uri',
  'sulfur/ui/model'
], function (UriValue, Model) {

  'use strict';

  return Model.clone({

    get valueType() { return UriValue },

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
      if (value && !UriValue.isValidLiteral(value)) {
        errors.value = "must be a valid URI";
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
      var value = this.get('value');
      if (value && UriValue.isValidLiteral(value)) {
        return UriValue.parse(value);
      }
    }

  });

});
