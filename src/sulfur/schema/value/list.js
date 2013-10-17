/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/factory'], function ($factory) {

  'use strict';

  return $factory.derive({

    initialize: function (values) {
      this._values = values || [];
    },

    getValueAt: function (index) {
      return this._values[index];
    },

    getLength: function () {
      return this._values.length;
    },

    toArray: function () {
      return this._values;
    },

    eq: function (other) {
      if (this.getLength() !== other.getLength()) {
        return false;
      }
      return this._values.every(function (value, i) {
        return value.eq(other.getValueAt(i));
      });
    }

  });

});
