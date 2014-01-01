/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/ui/view/access/error',
  'sulfur/ui/view/dropdown',
  'sulfur/util/factory'
], function (ErrorAccess, Dropdown, Factory) {

  'use strict';

  return Factory.derive({

    initialize: function (element) {
      this._dropdown = Dropdown.create(element);
      this._errorAccess = ErrorAccess.create(element);
    },

    get publisher() {
      return this._dropdown.publisher;
    },

    get error() {
      return this._errorAccess.error;
    },

    set error(value) {
      this._errorAccess.error = value;
    },

    get value() {
      return this._dropdown.value;
    },

    set value(value) {
      this._dropdown.value = value;
    },

    get values() {
      return this._dropdown.values;
    },

    set values(values) {
      this._dropdown.values = values;
    }

  });

});
