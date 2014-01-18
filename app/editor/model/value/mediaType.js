/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/value/simple/mediaType',
  'sulfur/ui/model'
], function (MediaTypeValue, Model) {

  'use strict';

  return Model.clone({

    get valueType() { return MediaTypeValue },

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
      if (value && !MediaTypeValue.isValidLiteral(value)) {
        errors.value = "must be a valid media type";
      }
    },

    _construct: function () {
      var value = this.get('value');
      if (value && MediaTypeValue.isValidLiteral(value)) {
        return MediaTypeValue.parse(value);
      }
    }

  });

});
