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

  return Factory.derive({

    initialize: function (values) {
      var index = values.reduce(function (index, pair) {
        var name = pair[0];
        var value = pair[1];
        if (index.contains(name)) {
          throw new Error('duplicate name "' + name + '"');
        }
        index.set(name, value);
        return index;
      }, StringMap.create());
      this._index = index;
    },

    getValue: function (name) {
      var item = this._index.get(name);
      if (item) {
        return item;
      }
      throw new Error('name "' + name + '" is not associated with any value');
    }

  });

});
