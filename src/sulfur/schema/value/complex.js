/* Copyright (c) 2013, Erik Wienhold
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

  /*!
   * @abstract
   *
   * @implement {sulfur/schema/elements} .allowedElements
   */
  return Factory.derive({

    initialize: function (values) {
      var allowedElements = this.factory.allowedElements;

      var index = values.reduce(function (index, pair) {
        var name = pair[0];
        var value = pair[1];
        var element = allowedElements.getByName(name);
        if (!element) {
          throw new Error('unexpected value "' + name + '"');
        }
        if (index.contains(name)) {
          throw new Error('duplicate value "' + name + '"');
        }
        var v = element.type.createValidator();
        if (!v.validate(value)) {
          throw new Error('invalid value "' + name + '"');
        }
        index.set(name, value);
        return index;
      }, StringMap.create());

      allowedElements.toArray().forEach(function (element) {
        var name = element.name;
        if (!index.contains(name) && !element.isOptional) {
          throw new Error('missing value "' + name + '"');
        }
      });

      this._index = index;
    },

    value: function (name) {
      var item = this._index.get(name);
      if (item) {
        return item;
      }
      throw new Error('name "' + name + '" is not associated with any value');
    },

    eq: function (other) {
      if (Object.getPrototypeOf(this) !== Object.getPrototypeOf(other)) {
        return false;
      }
      return this._index.keys.every(function (name) {
        var x = this.value(name);
        var y = other.value(name);
        return x.eq(y);
      }.bind(this));
    }

  });

});
