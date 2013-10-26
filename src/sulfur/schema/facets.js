/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/util',
  'sulfur/util/factory',
  'sulfur/util/orderedMap'
], function (util, Factory, OrderedMap) {

  'use strict';

  var keyfn = util.property('qname');

  return Factory.derive({

    initialize: function (facets) {
      if (facets.length === 0) {
        throw new Error("expecting one or more facets");
      }
      this._index = facets.reduce(function (index, facet) {
        var qname = index.getKey(facet);
        if (index.containsKey(qname)) {
          throw new Error("facet with duplicate qualified name " + qname);
        }
        index.insert(facet);
        return index;
      }, OrderedMap.create(keyfn));
    },

    hasByQName: function (qname) {
      return this._index.containsKey(qname);
    },

    getByQName: function (qname) {
      return this._index.getItemByKey(qname);
    },

    get size() {
      return this._index.size;
    },

    toArray: function () {
      return this._index.toArray();
    }

  });

});
