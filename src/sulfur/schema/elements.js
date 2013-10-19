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

  var keyfn = util.method('getName');

  return Factory.derive({

    initialize: function (elements) {
      if (elements.length === 0) {
        throw new Error("expecting one or more elements");
      }
      this._index = elements.reduce(function (index, element) {
        var name = element.getName();
        if (index.containsKey(name)) {
          throw new Error('element with duplicate name "' + name + '"');
        }
        index.insert(element);
        return index;
      }, OrderedMap.create(keyfn));
    },

    getElement: function (name) {
      return this._index.getItemByKey(name);
    },

    getSize: function () {
      return this._index.getSize();
    },

    toArray: function () {
      return this._index.toArray();
    }

  });

});
