/*
 * Copyright (c) 2013, 2014, Erik Wienhold
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

    get file() {
      return this._element.files.item(0);
    }

  });

});
