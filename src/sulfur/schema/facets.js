/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/factory',
  'sulfur/util/orderedMap'
], function ($factory, $orderedMap) {

  'use strict';

  function keyfn(facet) {
    return facet.getQName().toString();
  }

  return $factory.derive({

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
      }, $orderedMap.create(keyfn));
    },

    hasFacet: function (qname) {
      return !!this.getFacet(qname);
    },

    getFacet: function (qname) {
      return this._index.getItemByKey(qname.toString());
    },

    getSize: function () {
      return this._index.getSize();
    },

    toArray: function () {
      return this._index.toArray();
    }

  });

});
