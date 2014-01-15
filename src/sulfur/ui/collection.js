/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/ui/publisher',
  'sulfur/ui/subscriptions',
  'sulfur/util/factory'
], function (Publisher, Subscriptions, Factory) {

  'use strict';

  return Factory.derive({

    /**
     * @api protected
     *
     * @param {array} items the initial items
     */
    initialize: function (items) {
      this._subscriptions = Subscriptions.create();
      this._publisher = Publisher.create();
      this._items = [];
      items && items.forEach(this.add.bind(this));
    },

    /**
     * @api public
     *
     * @return {sulfur/ui/publisher} the publisher
     */
    get publisher() {
      return this._publisher;
    },

    /**
     * @api public
     *
     * @return {number} the number of items
     */
    get size() {
      return this._items.length;
    },

    /**
     * @api public
     *
     * @return {array} an array of all items
     */
    get items() {
      return [].concat(this._items);
    },

    /**
     * Get the item at the given zero-based index.
     *
     * @api public
     *
     * @param {number} index
     *
     * @return {any} the item at the given index
     *
     * @throw {Error} when the index is out of bounds
     */
    item: function (index) {
      // Check the index to avoid exposing any array properties other than its
      // elements.
      if (index >= 0 && index < this._items.length) {
        return this._items[index];
      }
      throw new Error("index out of bounds");
    },

    /**
     * Check if all items are valid.
     *
     * @api public
     *
     * @return {true} when all items are valid
     * @return {false} when any item is not valid
     */
    isValid: function () {
      return this._items.every(function (m) {
        return typeof m.isValid !== 'function' || m.isValid();
      });
    },

    /**
     * Check if the collection contains the item based on strict equality.
     *
     * @api public
     *
     * @param {any} item
     *
     * @return {true} when the collection contains the item
     * @return {false} when the collection does not contain the item
     */
    contains: function (item) {
      return this.indexOf(item) >= 0;
    },

    /**
     * Get the index of the given item, based on strict equalitiy.
     *
     * @api public
     *
     * @param {any} item
     *
     * @return {number} the item's index or -1 when not contained
     */
    indexOf: function (item) {
      return this._items.indexOf(item);
    },

    /**
     * Add an item at the end of the collection when not already present.
     *
     * @api public
     *
     * @param {any} item
     *
     * @return {true} when the collection does not already contain the item
     * @return {false} when the collection already contains the item
     */
    add: function (item) {
      if (this.contains(item)) {
        return false;
      }
      this._items.push(item);
      if (item.publisher) {
        this._subscribe(item.publisher, 'change', function () {
          this._publish('change');
        }.bind(this));
        this._subscribe(item.publisher, 'destroy', function () {
          this.remove(item);
        }.bind(this));
      }
      this._publish('add', item);
      this._publish('change');
      return true;
    },

    /**
     * Remove an item from the collection.
     *
     * @api public
     *
     * @param {any} item
     *
     * @return {true} when the collection did contain the item
     * @return {false} when the collection did not contain the item
     */
    remove: function (item) {
      var i = this.indexOf(item);
      if (i === -1) {
        return false;
      }
      this._items.splice(i, 1);
      item.publisher && this._detach(item.publisher);
      this._publish('remove', item, i);
      this._publish('change');
      return true;
    },

    /**
     * Remove all items and publish on channel "destroy".
     *
     * @api public
     */
    destroy: function () {
      this.items.forEach(this.remove.bind(this));
      this._publish('destroy');
    },

    /**
     * @api protected
     */
    _subscribe: function (p, c, f) {
      this._subscriptions.subscribe(p, c, f);
    },

    /**
     * @api protected
     */
    _detach: function (p) {
      this._subscriptions.detach(p);
    },

    /**
     * @api private
     */
    _publish: function () {
      var args = Array.prototype.slice.call(arguments);
      args.splice(1, 0, this);
      this._publisher.publish.apply(this._publisher, args);
    }

  });

});
