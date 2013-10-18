/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/factory',
  'sulfur/util/orderedMap'
], function (Factory, OrderedMap) {

  'use strict';

  function keyfn(value) {
    return value.name;
  }

  return Factory.derive({

    initialize: function (values) {
      var index = values.reduce(function (index, pair) {
        var name = pair[0];
        var value = pair[1];
        var item = { name: name, value: value };
        if (index.containsKey(index.getKey(item))) {
          throw new Error('duplicate name "' + name + '"');
        }
        index.insert(item);
        return index;
      }, OrderedMap.create(keyfn));
      this._values = index;
    },

    getValue: function (name) {
      var item = this._values.getItemByKey(name);
      if (item) {
        return item.value;
      }
      throw new Error('name "' + name + '" is not associated with any value');
    }

  });

});
