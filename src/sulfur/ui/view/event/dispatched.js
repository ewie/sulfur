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

    initialize: function (method) {
      this._method = method;
    },

    bind: function (view) {
      if (typeof view[this._method] !== 'function') {
        throw new Error('expecting a view responding to "' + this._method + '"');
      }
      return function () {
        return view[this._method].apply(view, arguments);
      }.bind(this);
    }

  });

});
