/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global Text */

define([
  'sulfur/schema/value/complex',
  'sulfur/schema/value/list',
  'sulfur/schema/value/simple',
  'sulfur/schema/value/simple/list',
  'sulfur/util/factory'
], function (ComplexValue, ListValue, SimpleValue, SimpleListValue, Factory) {

  'use strict';

  function q(name) { return 'x:' + name }

  function createDocument(qname) {
    var name = qname.localName;
    return document.implementation.createDocument(qname.namespaceURI, q(name));
  }

  function isFactoryOf(f, x) { return f.prototype.isPrototypeOf(x) }

  function serializeValue(value, type, doc, ns) {
    if (isFactoryOf(SimpleValue, value) ||
        isFactoryOf(SimpleListValue, value))
    {
      return new Text(value);
    } else if (isFactoryOf(ComplexValue, value)) {
      return serializeComplexValue(value, type, doc, ns);
    } else if (isFactoryOf(ListValue, value)) {
      return serializeComplexListValue(value, type, doc, ns);
    }
  }

  function serializeComplexValue(value, type, doc, ns) {
    var df = doc.createDocumentFragment();
    value.names.forEach(function (name) {
      var e = doc.createElementNS(ns, q(name));
      var v = value.value(name);
      if (v) {
        // TODO uniform interface to get the elements
        var t = (type.elements || type.allowedElements).getByName(name).type;
        var f = serializeValue(v, t, doc, ns);
        e.appendChild(f);
        df.appendChild(e);
      }
    });
    return df;
  }

  function serializeComplexListValue(value, type, doc, ns) {
    var df = doc.createDocumentFragment();
    var itemName = type.element.name;
    var itemType = type.element.type;
    value.toArray().forEach(function (v) {
      var e = doc.createElementNS(ns, q(itemName));
      var f = serializeValue(v, itemType, doc, ns);
      df.appendChild(e);
      e.appendChild(f);
    });
    return df;
  }

  return Factory.derive({

    initialize: function (schema) {
      this._schema = schema;
    },

    serialize: function (record) {
      var schema = this._schema;
      var ns = schema.qname.namespaceURI;

      var doc = createDocument(this._schema.qname);
      var root = doc.documentElement;

      root.appendChild(serializeComplexValue(record, schema, doc, ns));

      return doc;
    }

  });

});
