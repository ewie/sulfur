/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/util/factory'], function (Factory) {

  'use strict';

  return Factory.derive({

    initialize: function (facet) {
      this._facet = facet;
    },

    getFacet: function () {
      return this._facet;
    },

    serializeFacet: function (facet, context) {
      var values = facet.getValue();
      if (!Array.isArray(values)) {
        values = [ values ];
      }
      var qname = this._facet.getQName();
      var prefix = context.getNamespacePrefix(qname.getNamespaceURI());
      var nodeName = prefix + ':' + qname.getLocalName();
      return values.map(function (value) {
        var e = context.createElement(qname.getNamespaceURI(), nodeName);
        e.setAttribute('value', value);
        return e;
      }.bind(this));
    }

  });

});
