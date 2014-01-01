/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/value/simple/integer',
  'sulfur/util/factory'
], function (IntegerValue, Factory) {

  'use strict';

  return Factory.derive({

    initialize: function (values) {
      this._values = values || [];
    },

    getValueAt: function (index) {
      return this._values[index];
    },

    get length() {
      var s = this._values.length.toString(10);
      return IntegerValue.create({ integralDigits: s });
    },

    toArray: function () {
      return this._values;
    },

    eq: function (other) {
      if (this._values.length !== other._values.length) {
        return false;
      }
      return this._values.every(function (value, i) {
        return value.eq(other.getValueAt(i));
      });
    }

  });

});
