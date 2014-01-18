/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/value/simple/boolean',
  'sulfur/ui/model'
], function (BooleanValue, Model) {

  'use strict';

  return Model.clone({

    get valueType() { return BooleanValue },

    attributes: {
      value: { default: null }
    },

    _extract: function (value) {
      return { value: value.value };
    }

  }).augment({

    get valueType() { return this.factory.valueType },

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
      if (typeof v === 'boolean') {
        return BooleanValue.create(v);
      }
    }

  });

});
