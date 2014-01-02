/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/regex',
  'sulfur/util/factory'
], function (Regex, Factory) {

  'use strict';

  return Factory.clone({

    isValidName: (function () {

      var namePattern = Regex.compile('[\\i-[:]][\\c-[:]]*');

      return function (s) { return namePattern.test(s) };

    }())

  }).augment({

    initialize: function (name, type, options) {
      if (!this.factory.isValidName(name)) {
        throw new Error("expecting name to be an NCName");
      }
      options || (options = {});
      this._name = name;
      this._type = type;
      this._optional = options.optional || false;
      this._default = options.default;
    },

    get name() { return this._name },

    get type() { return this._type },

    get defaultValue() { return this._default },

    get isOptional() { return this._optional }

  });

});
