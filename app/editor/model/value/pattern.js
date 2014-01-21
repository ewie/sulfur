/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/value/simple/pattern',
  'sulfur/ui/model',
  'unorm'
], function (PatternValue, Model, unorm) {

  'use strict';

  return Model.clone({

    get valueType() { return PatternValue },

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
      if (value) {
        var pattern;
        try {
          pattern = PatternValue.parse(value);
        } catch (e) {
          errors.value = e.message;
        }
        if (pattern) {
          pattern.containsGroupWithSurrogateCodepoints() && (errors.value = "group with surrogate codepoints causes unexpected behaviour");
          pattern.containsEmptyGroup() && (errors.value = "contains an empty group which cannot match any input");
        }
      }
    },

    _construct: function () {
      // Normalize to NFC (like string values) to ensure consistent matches.
      var s = unorm.nfc(this.get('value'));
      return PatternValue.create(s);
    }

  });

});
