/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/util/factory',
  'sulfur/util/orderedStringMap'
], function (Factory, OrderedStringMap) {

  'use strict';

  return Factory.derive({

    initialize: function (facets) {
      if (facets.length === 0) {
        throw new Error("expecting one or more facets");
      }
      this._index = facets.reduce(function (index, facet) {
        var qname = facet.qname;
        if (index.contains(qname)) {
          throw new Error("facet with duplicate qualified name " + qname);
        }
        index.set(qname, facet);
        return index;
      }, OrderedStringMap.create());
    },

    hasByQName: function (qname) {
      return this._index.contains(qname);
    },

    getByQName: function (qname) {
      return this._index.get(qname);
    },

    get size() {
      return this._index.size;
    },

    toArray: function () {
      return this._index.values;
    }

  });

});
