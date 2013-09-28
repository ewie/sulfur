/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/factory',
  'sulfur/schema/value/_simple',
  'sulfur/util'
], function ($factory, $_simpleValue, $util) {

  'use strict';

  return $factory.derive({

    initialize: function (itemValueType, items) {
      if (!$_simpleValue.isPrototypeOf(itemValueType)) {
        throw new Error("expecting an item value type derived from sulfur/schema/value/_simple");
      }
      if (items && !items.every($util.bind(itemValueType.prototype, 'isPrototypeOf'))) {
        throw new Error("expecting only items of the given item value type");
      }
      this._itemValueType = itemValueType;
      this._items = items || [];
    },

    getItemValueType: function () {
      return this._itemValueType;
    },

    getLength: function () {
      return this._items.length;
    },

    toArray: function () {
      return this._items;
    },

    toString: function () {
      return this._items.map($util.method('toString')).join(' ');
    }

  });

});
