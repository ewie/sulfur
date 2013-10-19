/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/util/factory'], function (Factory) {

  'use strict';

  function createNamespaceResolver(namespaces) {
    return function (prefix) {
      return namespaces[prefix] || null;
    };
  }

  return Factory.derive({

    initialize: function (document) {
      this._document = document;
    },

    evaluate: function (expr, resultType, contextNode, namespaces) {
      var namespaceResolver = createNamespaceResolver(namespaces || {});
      return this._document.evaluate(expr, contextNode || this._document,
        namespaceResolver, resultType, null);
    },

    all: function (expr, contextNode, namespaces) {
      var result = this.evaluate(expr, XPathResult.ORDERED_NODE_ITERATOR_TYPE,
        contextNode, namespaces);
      var nodes = [];
      var node = result.iterateNext();
      while (node) {
        nodes.push(node);
        node = result.iterateNext();
      }
      return nodes;
    },

    first: function (expr, contextNode, namespaces) {
      var result = this.evaluate(expr, XPathResult.FIRST_ORDERED_NODE_TYPE,
        contextNode, namespaces);
      return result.singleNodeValue;
    },

    count: function (expr, contextNode, namespaces) {
      expr = 'count(' + expr + ')';
      var result = this.evaluate(expr, XPathResult.NUMBER_TYPE, contextNode,
        namespaces);
      return result.numberValue;
    },

    contains: function (expr, contextNode, namespaces) {
      return this.count(expr, contextNode, namespaces) > 0;
    }

  });

});
