/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/factory'], function ($factory) {

  'use strict';

  return $factory.derive({

    initialize: function (name, elements) {
      if (!name) {
        throw new Error("schema name must not be empty");
      }

      this._name = name;
      this._elements = elements;
    },

    getName: function () {
      return this._name;
    },

    getElements: function () {
      return this._elements;
    }

  });

});
