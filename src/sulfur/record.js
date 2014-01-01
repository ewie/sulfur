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

  return Factory.derive({

    /**
     * @param {array} values an array of name/value pairs
     *
     * @throw {Error} when there are duplicate names
     */
    initialize: function (values) {
      this._index = values.reduce(function (index, pair) {
        var name = pair[0];
        var value = pair[1];
        if (index.contains(name)) {
          throw new Error('duplicate value with name "' + name + '"');
        }
        index.set(name, value);
        return index;
      }, StringMap.create());
    },

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
