/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/util',
  'sulfur/util/factory',
  'app/editor/settings'
], function (util, Factory) {

  'use strict';

  return Factory.derive({

    initialize: function (callback) {
      this._callback = callback;
    },

    check: function (url) {
      this._req && this._req.abort();
      var cb = this._callback;
      this._req = util.request({
        method: 'GET',
        url: url,
        success: function () {
          cb({ found: true });
        },
        fail: function (xhr) {
          cb({
            found: false,
            error: xhr.status === 0 || xhr.status >= 500
          });
        }
      });
    }

  });

});
