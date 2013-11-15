/* global define */

define(['sulfur/util/factory'], function (Factory) {

  'use strict';

  var createNamespaceResolver = (function () {

    var hasOwn = Object.prototype.hasOwnProperty;

    var nil = function () {
      return null;
    };

    var wrap = function (namespaces) {
      return function (prefix) {
        return (hasOwn.call(namespaces, prefix) && namespaces[prefix]) || null;
      };
    };

    return function (namespaces) {
      if (typeof namespaces === 'function') {
        return namespaces;
      } else if (namespaces) {
        return wrap(namespaces);
      } else {
        return nil;
      }
    };

  }());

  return Factory.derive({

    initialize: function (contextNode) {
      this._contextNode = contextNode;
    },

    evaluate: function (expr, resultType, contextNode, namespaces) {
      var d = this._contextNode.ownerDocument || this._contextNode;
      contextNode || (contextNode = this._contextNode);
      var namespaceResolver = createNamespaceResolver(namespaces);
      return d.evaluate(expr, contextNode, namespaceResolver, resultType, null);
    },

    all: function (expr, contextNode, namespaces) {
      var result = this.evaluate(expr, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        contextNode, namespaces);
      var nodes = [];
      for (var i = 0; i < result.snapshotLength; i += 1) {
        nodes.push(result.snapshotItem(i));
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
