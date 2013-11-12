/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/util/stringMap'], function (StringMap) {

  'use strict';

  function removeKey(map, key) {
    map.contains(key) && map._keys.splice(map._keys.indexOf(key), 1);
  }

  return StringMap.derive({

    initialize: function () {
      StringMap.prototype.initialize.call(this);
      this._keys = [];
    },

    get values() {
      return this._keys.map(function (key) {
        return this.get(key);
      }.bind(this));
    },

    set: function (key, value) {
      var k = key.toString();
      removeKey(this, k);
      StringMap.prototype.set.call(this, key, value);
      this._keys.push(k);
    },

    remove: function (key) {
      removeKey(this, key.toString());
      StringMap.prototype.remove.call(this, key);
    }

  });

});
