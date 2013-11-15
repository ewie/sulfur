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
  'sulfur/util/stringMap',
  'sulfur/util/xpath'
], function (
    Factory,
    Facets,
    DerivedType,
    ListType,
    PrimitiveType,
    RestrictedType,
    util,
    StringMap,
    XPath
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

    initialize: function (types, facetResolvers) {
      if (types.length === 0) {
        throw new Error("expecting an array of one or more types");
      }

      if (facetResolvers.length === 0) {
        throw new Error("expecting an array of one or more facet resolvers");
      }

      var facetResolverIndex = facetResolvers.reduce(function (index, facetResolver) {
        var qname = facetResolver.facet.qname;
        if (index.contains(qname)) {
          throw new Error("facet resolver with duplicate facet " + qname);
        }
        index.set(qname, facetResolver);
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
          if (!facetResolverIndex.contains(qname)) {
            throw new Error("expecting a facet resolver for facet " + qname);
          }
        });
        index.set(qname, type);
        return index;
      }, StringMap.create());

      this._typeIndex = typeIndex;
      this._facetResolverIndex = facetResolverIndex;
    },

    resolveQualifiedName: function (qname) {
      return this._typeIndex.get(qname);
    },

    resolveTypeElement: (function () {

      function resolveReferencedBase(restriction, resolver) {
        var baseName = restriction.getAttribute('base');
        var qname = resolver.resolveQualifiedName(baseName, restriction);
        return resolver.resolveNamedType(qname);
      }

      function resolveInlinedBase(restriction, resolver, xpath) {
        var type = xpath.first('xs:simpleType', restriction, NS);
        return resolver.resolveTypeElement(type, xpath);
      }

      function resolveAnyFacets(facetResolvers, allowedFacets, valueType,
          parentElement, xpath)
      {
        return allowedFacets.reduce(function (facets, allowedFacet) {
          var qname = allowedFacet.qname;
          var name = qname.localName;
          var namespace = qname.namespaceURI;
          var ns = { ns: namespace };
          var facetElements = xpath.all('ns:' + name, parentElement, ns);
          if (facetElements.length > 0) {
            var facetResolver = facetResolvers.get(qname);
            var values = facetElements.map(function (facetElement) {
              var value = facetElement.getAttribute('value');
              return facetResolver.parseValue(value, valueType);
            });
            facets.push(facetResolver.createFacet(values));
          }
          return facets;
        }, []);
      }

      function resolveNonStandardFacets(facetResolvers, allowedFacets,
          valueType, restriction, xpath)
      {
        var appinfo = xpath.first('xs:annotation/xs:appinfo', restriction, NS);
        if (appinfo) {
          return resolveAnyFacets(facetResolvers, allowedFacets, valueType,
            appinfo, xpath);
        }
        return [];
      }

      function resolveFacets(facetResolvers, allowedFacets, valueType,
          restriction, xpath)
      {
        var part = util.bipart(allowedFacets.toArray(), function (facet) {
          return facet.qname.namespaceURI === XSD_NAMESPACE;
        });

        var stdFacets = resolveAnyFacets(facetResolvers, part.true, valueType,
          restriction, xpath);
        var nonStdFacets = resolveNonStandardFacets(facetResolvers, part.false,
          valueType, restriction, xpath);

        var facets = stdFacets.concat(nonStdFacets);

        if (facets.length) {
          return Facets.create(facets);
        }
      }

      function resolveRestriction(restriction, resolver, xpath, facetResolvers) {
        var baseType;
        if (restriction.hasAttribute('base')) {
          baseType = resolveReferencedBase(restriction, resolver);
        } else {
          baseType = resolveInlinedBase(restriction, resolver, xpath);
        }

        var facets = resolveFacets(facetResolvers, baseType.allowedFacets,
          baseType.valueType, restriction, xpath);

        if (facets) {
          return RestrictedType.create(baseType, facets);
        } else {
          return baseType;
        }
      }

      function resolveReferencedItemType(list, resolver) {
        var itemTypeName = list.getAttribute('itemType');
        var qname = resolver.resolveQualifiedName(itemTypeName, list);
        return resolver.resolveNamedType(qname);
      }

      function resolveInlinedItemType(list, resolver, xpath) {
        var simpleType = xpath.first('xs:simpleType', list, NS);
        return resolver.resolveTypeElement(simpleType, xpath);
      }

      function resolveList(list, resolver, xpath) {
        var itemType;
        if (list.hasAttribute('itemType')) {
          itemType = resolveReferencedItemType(list, resolver);
        } else {
          itemType = resolveInlinedItemType(list, resolver, xpath);
        }
        return ListType.create(itemType);
      }

      return function (element, resolver) {
        if (element.localName !== 'simpleType' ||
            element.namespaceURI !== XSD_NAMESPACE)
        {
          return;
        }

        var xpath = XPath.create(element);

        var restriction = xpath.first('xs:restriction', element, NS);
        if (restriction) {
          return resolveRestriction(restriction, resolver, xpath,
            this._facetResolverIndex);
        }

        var list = xpath.first('xs:list', element, NS);
        if (list) {
          return resolveList(list, resolver, xpath);
        }
      };

    }())

  });

});
