/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/factory'], function ($factory) {

  'use strict';

  var sanitizeKey = (function () {

    var SANITIZABLE_KEY_PATTERN = /^\$*__proto__$/;

    return function sanitizeKey(key) {
      if (SANITIZABLE_KEY_PATTERN.test(key)) {
        key = '$' + key;
      }
      return key;
    };

  }());

  return $factory.derive({

    /**
     * @param [function] key (default #toString()) a key function
     * @param [array] items (optional) initial items to be inserted
     */
    initialize: (function () {

      var DEFAULT_KEY_FN = function (x) { return x.toString(); };

      return function (key, items) {
        if (typeof key === 'function') {
          this._key = key;
        } else {
          this._key = DEFAULT_KEY_FN;
          items = key;
        }
        this._index = {};
        this._items = [];
        if (items) {
          items.forEach(function (item) {
            this.insert(item);
          }.bind(this));
        }
      };

    }()),

    countItems: function () {
      return this._items.length;
    },

    isEmpty: function () {
      return this.countItems() === 0;
    },

    /**
     * Get an item's key.
     *
     * @param [any] item
     *
     * @return [string] the item's key
     */
    getKey: function (item) {
      return this._key(item);
    },

    /**
     * Check if the map associates a key with an item.
     *
     * @param [string] key the key to check
     *
     * @return [boolean] whether the key is associated with an item or not
     */
    containsKey: function (key) {
      var newkey = sanitizeKey(key);
      return this._index.hasOwnProperty(newkey);
    },

    /**
     * Check if the map contains a specific item.
     *
     * @param [any] item the item to check
     *
     * @return [boolean] whether the map contains the item, based on strict
     *   equality, or not
     */
    containsItem: function (item) {
      var candidateItem = this.getItemByKey(this.getKey(item));
      return candidateItem ? candidateItem === item : false;
    },

    /**
     * @param [string] key
     *
     * @return [any] the item associated with the key
     * @return [undefined] if no item is associated with the key
     */
    getItemByKey: function (key) {
      key = sanitizeKey(key);
      if (this._index.hasOwnProperty(key)) {
        return this._index[key];
      }
    },

    /**
     * Check if an item can be safely inserted into the map, i.e. the item's
     * key is not associated with an item.
     *
     * @param [any] item
     *
     * @return [boolean] whether `item` can be safely inserted or not
     */
    canBeInserted: function (item) {
      return !this.containsKey(this.getKey(item));
    },

    /**
     * @param [any] item an item to insert
     *
     * @throw [Error] if the key generated from `item` is already associated
     *   with another item
     */
    insert: function (item) {
      if (!this.canBeInserted(item)) {
        throw new Error('key "' + this.getKey(item) + '" is already associated with an item');
      }
      var key = sanitizeKey(this.getKey(item));
      this._index[key] = item;
      this._items.push(item);
    },

    /**
     * Get the array of items in insertion order.
     *
     * @return [array] the items
     */
    toArray: function () {
      return this._items;
    }

  });

});
