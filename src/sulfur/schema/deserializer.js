/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/util/factory',
  'sulfur/schema',
  'sulfur/schema/deserializer/type',
  'sulfur/schema/elements',
  'sulfur/schema/qname',
  'sulfur/util/xpath'
], function (Factory, Schema, TypeDeserializer, Elements, QName, XPath) {

  'use strict';

  var XSD_NAMESPACE = 'http://www.w3.org/2001/XMLSchema';

  return Factory.derive({

    initialize: function (typeDeserializers) {
      this._typeDeserializers = typeDeserializers;
    },

    deserialize: function (document) {
      var root = document.documentElement;

      if (root.localName !== 'schema') {
        throw new Error("expecting an XML Schema document");
      }

      if (root.namespaceURI !== XSD_NAMESPACE) {
        throw new Error("expecting an XML Schema document");
      }

      var xpath = XPath.create(document);
      var typeDeserializer = TypeDeserializer.create(this._typeDeserializers);

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
          var element;
          try {
            element = typeDeserializer.deserializeElement(el, xpath);
          } catch (e) {
            if (el.getAttribute('minOccurs') === '0') {
              continue;
            } else {
              compatible = false;
              break;
            }
          }
          elements.push(element);
        }

        // use the first compatible root element declaration and stop
        if (compatible) {
          var qname = QName.create(
            _root.getAttribute('name'),
            root.getAttribute('targetNamespace'));
          return Schema.create(qname, Elements.create(elements));
        }
      }

      throw new Error("expecting a compatible root element declaration");
    }

  });

});
