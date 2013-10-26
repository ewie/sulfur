/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/util/factory'], function (Factory) {

  'use strict';

  return Factory.derive({

    initialize: function (name, elements) {
      if (!name) {
        throw new Error("schema name must not be empty");
      }

      this._name = name;
      this._elements = elements;
    },

    get name() {
      return this._name;
    },

    get elements() {
      return this._elements;
    }

  });

});
