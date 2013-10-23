/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/util/factory'], function(Factory) {

  'use strict';

  return Factory.derive({

    initialize: function (document) {
      this._document = document;
    },

    createElement: function (namespaceURI, qname) {
      return this._document.createElement(namespaceURI, qname);
    },

    getNamespacePrefix: (function () {

      function findUniquePrefix(doc) {
        for (var i = 1; ; i += 1) {
          var prefix = 'ns' + i;
          if (!doc.lookupNamespaceURI(prefix)) {
            return prefix;
          }
        }
      }

      return function (namespaceURI) {
        var prefix = this._document.lookupPrefix(namespaceURI);
        if (prefix === null) {
          prefix = findUniquePrefix(this._document);
          this._document.declareNamespace(namespaceURI, prefix,
            this._document.getRoot());
        }
        return prefix;
      };

    }())

  });

});
