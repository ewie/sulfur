/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/util/factory'], function (Factory) {

  'use strict';

  return Factory.derive({

    initialize: function (name, access) {
      this._name = name;
      this._access = access;
    },

    get name() {
      return this._name;
    },

    get access() {
      return this._access;
    }

  });

});
