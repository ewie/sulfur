/*
 * Copyright (c) 2013, 2014, Erik Wienhold
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

    get facet() {
      return this._facet;
    },

    serializeFacet: function (facet, context) {
      var values = facet.value;
      if (!Array.isArray(values)) {
        values = [ values ];
      }
      var qname = this.facet.qname;
      var prefix = context.getNamespacePrefix(qname.namespaceURI);
      var nodeName = prefix + ':' + qname.localName;
      return values.map(function (value) {
        var e = context.createElement(qname.namespaceURI, nodeName);
        e.setAttribute('value', value);
        return e;
      }.bind(this));
    }

  });

});
