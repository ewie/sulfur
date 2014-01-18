/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'highlight',
  'sulfur',
  'sulfur/schema/serializer',
  'sulfur/schema/serializer/facet',
  'sulfur/schema/serializer/type',
  'sulfur/schema/serializer/type/complex',
  'sulfur/schema/serializer/type/simple',
  'sulfur/schema/types',
  'sulfur/util/factory',
  'sulfur/util/stringMap',
  'sulfur/util/xmlSerializer'
], function (
    highlight,
    sulfur,
    Serializer,
    FacetSerializer,
    TypeSerializer,
    ComplexTypeSerializer,
    SimpleTypeSerializer,
    schemaTypes,
    Factory,
    StringMap,
    XmlSerializer
) {

  'use strict';

  return Factory.derive({

    initialize: function (indentSkip, lineLength) {
      this._indentSkip = indentSkip || ' ';
      this._lineLength = lineLength || 80;
      var facets = schemaTypes.simpleTypes.reduce(function (index, type) {
        return type.allowedFacets.toArray().reduce(function (index, facet) {
          var qname = facet.qname;
          if (!index.contains(qname)) {
            index.set(qname, facet);
          }
          return index;
        }, index);
      }, StringMap.create()).values;
      var fs = facets.map(function (f) {
        return FacetSerializer.create(f);
      });
      var sts = SimpleTypeSerializer.create(schemaTypes.simpleTypes, fs);
      var cts = ComplexTypeSerializer.create(schemaTypes.complexTypes);
      var ts = TypeSerializer.create([ sts, cts ]);
      this._serializer = Serializer.create(ts, [
        [ sulfur.namespaceURI, sulfur.schemaLocationURL ]
      ]);
    },

    serializeToString: function (schema) {
      var d = this._serializer.serialize(schema);
      var xs = XmlSerializer.create();
      return xs.serializeToString(d);
    },

    serializeToMarkup: function (schema) {
      var s = this._prettify(this.serializeToString(schema));
      s = '<?xml version="1.0" encoding="utf-8"?>\n' + s;
      return highlight.highlight('xml', s).value;
    },

    _prettify: function (s) {
      var ps = s.slice(1, s.length - 1).split('><');
      var out = '';
      var depth = 0;
      for (var i = 0; i < ps.length; i += 1) {
        var p = ps[i];
        if (p.indexOf('/') === 0) {
          depth -= 1;
        }
        out += this._indent(depth);
        out += '<';
        for (var j = 0, q = false; j < p.length; j += 1) {
          // TODO ignore whitespace inside an attribute's value
          if (p[j] === '"') {
            q = !q;
          }
          if (!q && p[j] === ' ' && (out.length - out.lastIndexOf('\n')) >= this._lineLength) {
            out += '\n' + this._indent(depth + 1);
          }
          out += p[j];
        }
        out += '>';
        out += '\n';
        if (p.indexOf('/') !== 0 && p.lastIndexOf('/') !== p.length - 1) {
          depth += 1;
        }
      }
      return out;
    },

    _indent: function (depth) {
      var s = '';
      while (depth--) {
        s += this._indentSkip;
      }
      return s;
    }

  });

});
