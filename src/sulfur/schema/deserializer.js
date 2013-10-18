/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/factory',
  'sulfur/schema',
  'sulfur/schema/deserializer/resolver',
  'sulfur/schema/element',
  'sulfur/util/xpath'
], function ($factory, $schema, $resolver, $element, $xpath) {

  'use strict';

  var XSD_NAMESPACE = 'http://www.w3.org/2001/XMLSchema';

  return $factory.derive({

    initialize: function (typeResolvers) {
      this._typeResolvers = typeResolvers;
    },

    deserialize: function (document) {
      var root = document.documentElement;

      if (root.localName !== 'schema') {
        throw new Error("expecting an XML Schema document");
      }

      if (root.namespaceURI !== XSD_NAMESPACE) {
        throw new Error("expecting an XML Schema document");
      }

      var xpath = $xpath.create(document);
      var resolver = $resolver.create(this._typeResolvers, xpath);

      var ns = { xs: XSD_NAMESPACE };
      var roots = xpath.all('xs:element', root, ns);

      for (var i = 0; i < roots.length; i += 1) {
        var _root = roots[i];
        if (!xpath.contains('xs:complexType/xs:all', _root, ns)) {
          continue;
        }
        var els = xpath.all('xs:complexType/xs:all/xs:element', _root, ns);
        var elements = [];
        var compatible = true;
        for (var j = 0; j < els.length; j += 1) {
          var el = els[j];
          if (el.getAttribute('maxOccurs') === '0') {
            continue;
          }
          var type;
          try {
            type = resolver.resolveElementType(el);
          } catch (e) {
            if (el.getAttribute('minOccurs') === '0') {
              continue;
            } else {
              compatible = false;
              break;
            }
          }
          elements.push($element.create(el.getAttribute('name'), type));
        }
        if (compatible) {
          return $schema.create(_root.getAttribute('name'), elements);
        }
      }

      throw new Error("expecting a compatible root element declaration");
    }

  });

});
