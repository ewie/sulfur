/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/util/factory'], function (Factory) {

  'use strict';

  var uid = (function () {

    var hasOwn = Object.prototype.hasOwnProperty;

    var next = (function () {
      var counter = 0;
      return function next() {
        return (counter += 1).toString(36);
      };
    }());

    var secret = '\uD83D\uDCA9' + Math.random().toString(36).substr(2);

    return function uid(obj) {
      if (hasOwn.call(obj, secret)) {
        return obj[secret];
      }
      var value = next();
      Object.defineProperty(obj, secret, { value: value });
      return value;
    };

  }());

  return Factory.derive({

    initialize: function () {
      this.clear();
    },

    get size() {
      return this._size;
    },

    get keys() {
      var keys = [];
      for (var u in this._index) {
        keys.push(this._index[u][0]);
      }
      return keys;
    },

    get values() {
      var values = [];
      for (var u in this._index) {
        values.push(this._index[u][1]);
      }
      return values;
    },

    clear: function () {
      this._index = Object.create(null);
      this._size = 0;
    },

    contains: function (key) {
      var u = uid(key);
      if (u in this._index) {
        if (this._index[u][0] === key) {
          return true;
        }
        throw new Error("key object with non-unique ID");
      }
      return false;
    },

    set: function (key, value) {
      if (!this.contains(key)) {
        this._size += 1;
      }
      this._index[uid(key)] = [ key, value ];
    },

    get: function (key) {
      var u = uid(key);
      return this._index[u] && this._index[u][1];
    },

    remove: function (key) {
      if (this.contains(key)) {
        this._size -= 1;
      }
      delete this._index[uid(key)];
    }

  });

});
