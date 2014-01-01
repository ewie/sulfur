/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/util/factory'], function (Factory) {

  'use strict';

  return Factory.clone({

    isValidName: function (s) {
      return /^[A-Za-z0-9_-]+$/.test(s);
    }

  }).augment({

    initialize: function (name, schema) {
      if (!this.factory.isValidName(name)) {
        throw new Error("expecting a valid name");
      }
      this._name = name;
      this._schema = schema;
    },

    get name() { return this._name },

    get schema() { return this._schema }

  });

});
