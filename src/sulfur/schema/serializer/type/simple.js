/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/type/simple/list',
  'sulfur/schema/type/simple/restricted',
  'sulfur/util',
  'sulfur/util/factory',
  'sulfur/util/stringMap'
], function (ListType, RestrictedType, util, Factory, StringMap) {

  'use strict';

  var XSD_NS = 'http://www.w3.org/2001/XMLSchema';

  return Factory.derive({

    initialize: function (types, facetSerializers) {
      var facetSerializerIndex = facetSerializers.reduce(function (index, facetSerializer) {
        var qname = facetSerializer.facet.qname;
        if (index.contains(qname)) {
          throw new Error("facet serializer with duplicate facet " + qname);
        }
        index.set(qname, facetSerializer);
        return index;
      }, StringMap.create());

      var typeIndex = types.reduce(function (index, type) {
        var qname = type.qname;
        if (index.contains(qname)) {
          throw new Error("type with duplicate qualified name " + qname);
        }
        type.allowedFacets.toArray().forEach(function (allowedFacet) {
          var qname = allowedFacet.qname;
          if (!facetSerializerIndex.contains(qname)) {
            throw new Error("expecting a facet serializer for facet " + qname);
          }
        });
        index.set(qname, type);
        return index;
      }, StringMap.create());

      this._typeIndex = typeIndex;
      this._facetSerializerIndex = facetSerializerIndex;
    },

    hasTypeWithQualifiedName: function (qname) {
      return this._typeIndex.contains(qname);
    },

    serializeType: (function () {

      function serializeListType(type, typeSerializer, context) {
        var e = context.createElement(XSD_NS, 'xs:list');
        var itemType = type.itemType;
        if (itemType.qname) {
          var qname = itemType.qname;
          var prefix = context.getNamespacePrefix(qname.namespaceURI);
          e.setAttribute('itemType', prefix + ':' + qname.localName);
        } else {
          var f = typeSerializer.serializeType(itemType, context);
          e.appendChild(f);
        }
        return e;
      }

      function serializeRestrictedType(self, type, typeSerializer, context) {
        var e = context.createElement(XSD_NS, 'xs:restriction');
        var baseType = type.base;
        if (baseType.qname) {
          var qname = baseType.qname;
          var prefix = context.getNamespacePrefix(qname.namespaceURI);
          e.setAttribute('base', prefix + ':' + qname.localName);
        } else {
          var f = typeSerializer.serializeType(baseType, context);
          e.appendChild(f);
        }

        var part = util.bipart(type.facets.toArray(), function (facet) {
          return facet.qname.namespaceURI === XSD_NS;
        });

        part.true.forEach(function (facet) {
          var qname = facet.qname;
          var facetSerializer = this._facetSerializerIndex.get(qname);
          var f = facetSerializer.serializeFacet(facet, context);
          f.forEach(function (f) {
            e.appendChild(f);
          });
        }.bind(self));

        if (part.false.length > 0) {
          var an = context.createElement(XSD_NS, 'xs:annotation');
          e.appendChild(an);

          var ai = context.createElement(XSD_NS, 'xs:appinfo');
          an.appendChild(ai);

          part.false.forEach(function (facet) {
            var qname = facet.qname;
            var facetSerializer = this._facetSerializerIndex.get(qname);
            var f = facetSerializer.serializeFacet(facet, context);
            f.forEach(function (f) {
              ai.appendChild(f);
            });
          }.bind(self));
        }

        return e;
      }

      return function (type, typeSerializer, context) {
        var isList = ListType.prototype.isPrototypeOf(type);
        var isRestriction = RestrictedType.prototype.isPrototypeOf(type);

        if (!isList && !isRestriction) {
          return;
        }

        var e = context.createElement(XSD_NS, 'xs:simpleType');
        var f;

        if (isList) {
          f = serializeListType(type, typeSerializer, context);
        } else {
          f = serializeRestrictedType(this, type, typeSerializer, context);
        }

        e.appendChild(f);

        return e;
      };

    }())

  });

});
