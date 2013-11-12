/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/util/factory',
  'sulfur/schema/facets',
  'sulfur/schema/type/simple/derived',
  'sulfur/schema/type/simple/list',
  'sulfur/schema/type/simple/primitive',
  'sulfur/schema/type/simple/restricted',
  'sulfur/util',
  'sulfur/util/stringMap'
], function (
    Factory,
    Facets,
    DerivedType,
    ListType,
    PrimitiveType,
    RestrictedType,
    util,
    StringMap
) {

  'use strict';

  var XSD_NAMESPACE = 'http://www.w3.org/2001/XMLSchema';

  var NS = { xs: XSD_NAMESPACE };

  function isFactoryOf(f, x) {
    return f.prototype.isPrototypeOf(x);
  }

  function isAtomicType(x) {
    return isFactoryOf(PrimitiveType, x);
  }

  function isDerivedType(x) {
    return isFactoryOf(DerivedType, x);
  }

  return Factory.derive({

    initialize: function (types, facetDeserializers) {
      if (types.length === 0) {
        throw new Error("expecting an array of one or more types");
      }

      if (facetDeserializers.length === 0) {
        throw new Error("expecting an array of one or more facet deserializers");
      }

      var facetDeserializerIndex = facetDeserializers.reduce(function (index, facetDeserializer) {
        var qname = facetDeserializer.facet.qname;
        if (index.contains(qname)) {
          throw new Error("facet deserializer with duplicate facet " + qname);
        }
        index.set(qname, facetDeserializer);
        return index;
      }, StringMap.create());

      var typeIndex = types.reduce(function (index, type) {
        if (!isAtomicType(type) && !isDerivedType(type)) {
          throw new Error("expecting only sulfur/schema/type/simple/{derived,primitive} types");
        }
        var qname = type.qname;
        if (index.contains(qname)) {
          throw new Error("type with duplicate qualified name " + qname);
        }
        type.allowedFacets.toArray().forEach(function (allowedFacet) {
          var qname = allowedFacet.qname;
          if (!facetDeserializerIndex.contains(qname)) {
            throw new Error("expecting a facet deserializer for facet " + qname);
          }
        });
        index.set(qname, type);
        return index;
      }, StringMap.create());

      this._typeIndex = typeIndex;
      this._facetDeserializerIndex = facetDeserializerIndex;
    },

    resolveQualifiedName: function (qname) {
      return this._typeIndex.get(qname);
    },

    deserializeElement: (function () {

      function resolveReferencedBase(restriction, typeDeserializer, xpath) {
        var baseName = restriction.getAttribute('base');
        var globalType = typeDeserializer.resolveGlobalType(baseName, xpath);
        if (globalType) {
          return globalType;
        }
        var qname = typeDeserializer.resolveQualifiedName(baseName, restriction);
        return typeDeserializer.resolveNamedType(qname);
      }

      function resolveInlinedBase(restriction, typeDeserializer, xpath) {
        var type = xpath.first('xs:simpleType', restriction, NS);
        return typeDeserializer.deserializeType(type, xpath);
      }

      function resolveAnyFacets(facetDeserializers, allowedFacets, valueType,
          parentElement, xpath)
      {
        return allowedFacets.reduce(function (facets, allowedFacet) {
          var qname = allowedFacet.qname;
          var name = qname.localName;
          var namespace = qname.namespaceURI;
          var ns = { ns: namespace };
          var facetElements = xpath.all('ns:' + name, parentElement, ns);
          if (facetElements.length > 0) {
            var facetDeserializer = facetDeserializers.get(qname);
            var values = facetElements.map(function (facetElement) {
              var value = facetElement.getAttribute('value');
              return facetDeserializer.parseValue(value, valueType);
            });
            facets.push(facetDeserializer.createFacet(values));
          }
          return facets;
        }, []);
      }

      function resolveNonStandardFacets(facetDeserializers, allowedFacets,
          valueType, restriction, xpath)
      {
        var appinfo = xpath.first('xs:annotation/xs:appinfo', restriction, NS);
        if (appinfo) {
          return resolveAnyFacets(facetDeserializers, allowedFacets, valueType,
            appinfo, xpath);
        }
        return [];
      }

      function resolveFacets(facetDeserializers, allowedFacets, valueType,
          restriction, xpath)
      {
        var part = util.bipart(allowedFacets.toArray(), function (facet) {
          return facet.qname.namespaceURI === XSD_NAMESPACE;
        });

        var stdFacets = resolveAnyFacets(facetDeserializers, part.true, valueType,
          restriction, xpath);
        var nonStdFacets = resolveNonStandardFacets(facetDeserializers, part.false,
          valueType, restriction, xpath);

        var facets = stdFacets.concat(nonStdFacets);

        if (facets.length) {
          return Facets.create(facets);
        }
      }

      function resolveRestriction(restriction, typeDeserializer, xpath, facetDeserializers) {
        var baseType;
        if (restriction.hasAttribute('base')) {
          baseType = resolveReferencedBase(restriction, typeDeserializer, xpath);
        } else {
          baseType = resolveInlinedBase(restriction, typeDeserializer, xpath);
        }

        var facets = resolveFacets(facetDeserializers, baseType.allowedFacets,
          baseType.valueType, restriction, xpath);

        if (facets) {
          return RestrictedType.create(baseType, facets);
        } else {
          return baseType;
        }
      }

      function resolveReferencedItemType(list, typeDeserializer, xpath) {
        var itemTypeName = list.getAttribute('itemType');
        var globalType = typeDeserializer.resolveGlobalType(itemTypeName, xpath);
        if (globalType) {
          return globalType;
        }
        var qname = typeDeserializer.resolveQualifiedName(itemTypeName, list);
        return typeDeserializer.resolveNamedType(qname);
      }

      function resolveInlinedItemType(list, typeDeserializer, xpath) {
        var simpleType = xpath.first('xs:simpleType', list, NS);
        return typeDeserializer.deserializeType(simpleType, xpath);
      }

      function resolveList(list, typeDeserializer, xpath) {
        var itemType;
        if (list.hasAttribute('itemType')) {
          itemType = resolveReferencedItemType(list, typeDeserializer, xpath);
        } else {
          itemType = resolveInlinedItemType(list, typeDeserializer, xpath);
        }
        return ListType.create(itemType);
      }

      return function (element, typeDeserializer, xpath) {
        if (element.localName !== 'simpleType' ||
            element.namespaceURI !== XSD_NAMESPACE)
        {
          return;
        }

        var restriction = xpath.first('xs:restriction', element, NS);
        if (restriction) {
          return resolveRestriction(restriction, typeDeserializer, xpath,
            this._facetDeserializerIndex);
        }

        var list = xpath.first('xs:list', element, NS);
        if (list) {
          return resolveList(list, typeDeserializer, xpath);
        }
      };

    }())

  });

});
