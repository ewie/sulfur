/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/ui/view/access/error',
  'sulfur/util/factory'
], function (ErrorAccess, Factory) {

  'use strict';

  return Factory.derive({

    initialize: function (element) {
      this._element = element;
      this._errorAccess = ErrorAccess.create(element);
    },

    get error() {
      return this._errorAccess.error;
    },

    set error(value) {
      this._errorAccess.error = value;
    },

    get value() {
      return this._element.value;
    },

    set value(value) {
      // Don't set the value when equal, to avoid overwriting the current
      // cursor position.
      value === this.value || (this._element.value = value);
    }

  });

});
