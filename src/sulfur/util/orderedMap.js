/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/object'], function ($object) {

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

  return $object.derive({

    /**
     * @param [function] keyfn (default #toString()) a key function
     * @param [array] items (optional) initial items to be inserted
     */
    initialize: (function () {

      var DEFAULT_KEY_FN = function (x) { return x.toString(); };

      return function (keyfn, items) {
        if (typeof keyfn === 'function') {
          this.keyfn = keyfn;
        } else {
          this.keyfn = DEFAULT_KEY_FN;
          items = keyfn;
        }
        this.index = {};
        this.items = [];
        if (items) {
          items.forEach(function (item) {
            this.insert(item);
          }.bind(this));
        }
      };

    }()),

    /**
     * Check if an item can be safely inserted into the map, i.e. the item's
     * key is not associated with an item.
     *
     * @param [any] item
     *
     * @return [boolean] whether `item` can be safely inserted or not
     */
    canBeInserted: function (item) {
      var key = sanitizeKey(this.keyfn(item));
      return !this.index.hasOwnProperty(key);
    },

    /**
     * Check if the map contains a specific item.
     *
     * @param [any] item the item to check
     *
     * @return [boolean] whether the map contains the item, based on strict
     *   equality, or not
     */
    contains: function (item) {
      var candidateItem = this.getByKey(this.keyfn(item));
      return item === candidateItem;
    },

    /**
     * @param [string] key
     *
     * @return [any] the item associated with the key
     * @return [undefined] if no item is associated with the key
     */
    getByKey: function (key) {
      key = sanitizeKey(key);
      if (this.index.hasOwnProperty(key)) {
        return this.items[this.index[key]];
      }
    },

    /**
     * @param [any] item an item to insert
     *
     * @throw [Error] if the key generated from `item` is already associated
     *   with another item
     */
    insert: function (item) {
      var key = sanitizeKey(this.keyfn(item));
      if (this.index.hasOwnProperty(key)) {
        throw new Error('key "' + key + '" is already associated with an item');
      }
      this.index[key] = this.items.length;
      this.items.push(item);
    },

    /**
     * Get the array of items in insertion order.
     *
     * @return [array] the items
     */
    toArray: function () {
      return this.items;
    }

  });

});
