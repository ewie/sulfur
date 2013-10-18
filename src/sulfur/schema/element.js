/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/factory'], function (Factory) {

  'use strict';

  return Factory.derive({

    initialize: function (name, type, options) {
      this._name = name;
      this._type = type;
      this._optional = options && options.optional || false;
    },

    getName: function () {
      return this._name;
    },

    getType: function () {
      return this._type;
    },

    isOptional: function () {
      return this._optional;
    }

  });

});
