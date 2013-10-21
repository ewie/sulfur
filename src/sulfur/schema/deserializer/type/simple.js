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
  'sulfur/util/orderedMap'
], function (
    Factory,
    Facets,
    DerivedType,
    ListType,
    PrimitiveType,
    RestrictedType,
    util,
    OrderedMap
) {

  'use strict';

  var XSD_NAMESPACE = 'http://www.w3.org/2001/XMLSchema';

  var NS = { xs: XSD_NAMESPACE };

  function typeKeyFn(type) {
    return type.getQName().toString();
  }

  function facetDeserializerKeyFn(facetDeserializer) {
    return typeKeyFn(facetDeserializer.getFacet());
  }

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
        var qname = index.getKey(facetDeserializer);
        if (index.containsKey(qname)) {
          throw new Error("facet deserializer with duplicate facet " + qname);
        }
        index.insert(facetDeserializer);
        return index;
      }, OrderedMap.create(facetDeserializerKeyFn));

      var typeIndex = types.reduce(function (index, type) {
        if (!isAtomicType(type) && !isDerivedType(type)) {
          throw new Error("expecting only sulfur/schema/type/simple/{primitive,derived} types");
        }
        var qname = index.getKey(type);
        if (index.containsKey(qname)) {
          throw new Error("type with duplicate qualified name " + qname);
        }
        type.getAllowedFacets().toArray().forEach(function (allowedFacet) {
          var qname = allowedFacet.getQName().toString();
          if (!facetDeserializerIndex.containsKey(qname)) {
            throw new Error("expecting a facet deserializer for facet " + qname);
          }
        });
        index.insert(type);
        return index;
      }, OrderedMap.create(typeKeyFn));

      this._typeIndex = typeIndex;
      this._facetDeserializerIndex = facetDeserializerIndex;
    },

    resolveQualifiedName: function (qname) {
      return this._typeIndex.getItemByKey(qname.toString());
    },

    deserializeElement: (function () {

      function resolveReferencedBase(restriction, typeDeserializer) {
        var baseName = restriction.getAttribute('base');
        var globalType = typeDeserializer.resolveGlobalType(baseName);
        if (globalType) {
          return globalType;
        }
        var qname = typeDeserializer.resolveQualifiedName(baseName, restriction);
        return typeDeserializer.resolveNamedType(qname);
      }

      function resolveInlinedBase(restriction, typeDeserializer) {
        var xpath = typeDeserializer.getXPath();
        var type = xpath.first('xs:simpleType', restriction, NS);
        return typeDeserializer.deserializeTypeElement(type);
      }

      function resolveAnyFacets(facetDeserializers, allowedFacets, valueType,
          parentElement, xpath)
      {
        return allowedFacets.reduce(function (facets, allowedFacet) {
          var qname = allowedFacet.getQName();
          var name = qname.getLocalName();
          var namespace = qname.getNamespaceURI();
          var ns = { ns: namespace };
          var facetElements = xpath.all('ns:' + name, parentElement, ns);
          if (facetElements.length > 0) {
            var facetDeserializer = facetDeserializers.getItemByKey(qname.toString());
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
          return facet.getQName().getNamespaceURI() === XSD_NAMESPACE;
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

      function resolveRestriction(restriction, facetDeserializers, typeDeserializer) {
        var baseType;
        if (restriction.hasAttribute('base')) {
          baseType = resolveReferencedBase(restriction, typeDeserializer);
        } else {
          baseType = resolveInlinedBase(restriction, typeDeserializer);
        }

        var facets = resolveFacets(facetDeserializers, baseType.getAllowedFacets(),
          baseType.getValueType(), restriction, typeDeserializer.getXPath());

        if (facets) {
          return RestrictedType.create(baseType, facets);
        } else {
          return baseType;
        }
      }

      function resolveReferencedItemType(list, typeDeserializer) {
        var itemTypeName = list.getAttribute('itemType');
        var globalType = typeDeserializer.resolveGlobalType(itemTypeName);
        if (globalType) {
          return globalType;
        }
        var qname = typeDeserializer.resolveQualifiedName(itemTypeName, list);
        return typeDeserializer.resolveNamedType(qname);
      }

      function resolveInlinedItemType(list, typeDeserializer) {
        var xpath = typeDeserializer.getXPath();
        var simpleType = xpath.first('xs:simpleType', list, NS);
        return typeDeserializer.deserializeTypeElement(simpleType);
      }

      function resolveList(list, typeDeserializer) {
        var itemType;
        if (list.hasAttribute('itemType')) {
          itemType = resolveReferencedItemType(list, typeDeserializer);
        } else {
          itemType = resolveInlinedItemType(list, typeDeserializer);
        }
        return ListType.create(itemType);
      }

      return function (element, typeDeserializer) {
        if (element.localName !== 'simpleType' ||
            element.namespaceURI !== XSD_NAMESPACE)
        {
          return;
        }

        var xpath = typeDeserializer.getXPath();

        var restriction = xpath.first('xs:restriction', element, NS);
        if (restriction) {
          return resolveRestriction(restriction, this._facetDeserializerIndex,
            typeDeserializer);
        }

        var list = xpath.first('xs:list', element, NS);
        if (list) {
          return resolveList(list, typeDeserializer);
        }
      };

    }())

  });

});
