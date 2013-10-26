/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/util/factory',
  'sulfur/util',
  'sulfur/util/orderedMap'
], function (Factory, util, OrderedMap) {

  'use strict';

  var keyfn = util.property('name');

  return Factory.derive({

    initialize: function (elements) {
      if (elements.length === 0) {
        throw new Error("expecting one or more elements");
      }
      this._index = elements.reduce(function (index, element) {
        var name = element.name;
        if (index.containsKey(name)) {
          throw new Error('element with duplicate name "' + name + '"');
        }
        index.insert(element);
        return index;
      }, OrderedMap.create(keyfn));
    },

    getByName: function (name) {
      return this._index.getItemByKey(name);
    },

    get size() {
      return this._index.size;
    },

    toArray: function () {
      return this._index.toArray();
    }

  });

});
