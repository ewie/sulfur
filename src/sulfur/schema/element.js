/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/util/factory'], function (Factory) {

  'use strict';

  return Factory.derive({

    initialize: function (name, type, options) {
      options || (options = {});
      this._name = name;
      this._type = type;
      this._optional = options.optional || false;
      this._default = options.default;
    },

    get name() {
      return this._name;
    },

    get type() {
      return this._type;
    },

    get default() {
      return this._default;
    },

    isOptional: function () {
      return this._optional;
    }

  });

});
