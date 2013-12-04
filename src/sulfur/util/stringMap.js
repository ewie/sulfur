/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/util/factory'], function (Factory) {

  'use strict';

  var sanitize = (function () {

    var pattern = /^__proto__\$*$/;

    return function (key) {
      if (pattern.test(key)) {
        key += '$';
      }
      return key;
    };

  }());

  return Factory.derive({

    initialize: function () {
      this._index = Object.create(null);
      this._size = 0;
    },

    get size() {
      return this._size;
    },

    get keys() {
      return Object.keys(this._index);
    },

    get values() {
      return this.keys.map(function (key) {
        return this._index[key];
      }.bind(this));
    },

    contains: function (key) {
      return sanitize(key) in this._index;
    },

    get: function (key) {
      return this._index[sanitize(key)];
    },

    set: function (key, value) {
      if (!this.contains(key)) {
        this._size += 1;
      }
      this._index[sanitize(key)] = value;
    },

    remove: function (key) {
      if (this.contains(key)) {
        this._size -= 1;
      }
      delete this._index[sanitize(key)];
    }

  });

});
