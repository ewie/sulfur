/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/util/factory',
  'sulfur/util/stringMap'
], function (Factory, StringMap) {

  'use strict';

  function indexValues(values) {
    return values.reduce(function (index, pair) {
      var name = pair[0];
      var value = pair[1];
      if (index.contains(name)) {
        throw new Error('duplicate value with name "' + name + '"');
      }
      index.set(name, value);
      return index;
    }, StringMap.create());
  }

  return Factory.derive({

    /**
     * @param {array} values an array of name/value pairs
     * @param {string} id (optional)
     *
     * @throw {Error} when there are duplicate names
     */
    initialize: function (values, id) {
      this._index = indexValues(values);
      this._id = id;
    },

    /**
     * @return {string} the record ID
     */
    get id() { return this._id },

    /**
     * @return {true} when the record is new
     * @return {false} when the record is not new
     */
    get isNew() { return !this._id },

    /**
     * @return {array} an array including each value's name
     */
    get names() { return this._index.keys },

    /**
     * @param {string} name
     *
     * @return {any} the value associated with the given name
     * @return {undefined} when no value with the given name is defined
     */
    value: function (name) {
      return this._index.get(name);
    }

  });

});
