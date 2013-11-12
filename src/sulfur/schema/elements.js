/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/util/factory',
  'sulfur/util/orderedStringMap'
], function (Factory, OrderedStringMap) {

  'use strict';

  return Factory.derive({

    initialize: function (elements) {
      if (elements.length === 0) {
        throw new Error("expecting one or more elements");
      }
      this._index = elements.reduce(function (index, element) {
        var name = element.name;
        if (index.contains(name)) {
          throw new Error('element with duplicate name "' + name + '"');
        }
        index.set(name, element);
        return index;
      }, OrderedStringMap.create());
    },

    getByName: function (name) {
      return this._index.get(name);
    },

    get size() {
      return this._index.size;
    },

    toArray: function () {
      return this._index.values;
    }

  });

});
