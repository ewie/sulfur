/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/util/factory'], function (Factory) {

  'use strict';

  return Factory.derive({

    initialize: function (values) {
      this._values = values || [];
    },

    getValueAt: function (index) {
      return this._values[index];
    },

    get length() {
      return this._values.length;
    },

    toArray: function () {
      return this._values;
    },

    eq: function (other) {
      if (this.length !== other.length) {
        return false;
      }
      return this._values.every(function (value, i) {
        return value.eq(other.getValueAt(i));
      });
    }

  });

});
