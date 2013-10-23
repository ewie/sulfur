/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/element',
  'sulfur/schema/qname',
  'sulfur/util/factory'
], function (Element, QName, Factory) {

  'use strict';

  var NS = { xs: 'http://www.w3.org/2001/XMLSchema' };

  return Factory.derive({

    /**
     * @param {array} typeDeserializers an array of type deserializers used in
     *   the given order
     */
    initialize: function (typeDeserializers) {
      this._typeDeserializers = typeDeserializers;
      this._referenceStack = [];
    },

    resolveGlobalType: function (name, xpath) {
      var expr = '(/xs:schema/xs:simpleType|/xs:schema/xs:complexType)' +
        '[@name = "' + name + '"]';
      var element = xpath.first(expr, undefined, NS);
      if (element) {
        return this.deserializeType(element, xpath);
      }
    },

    /**
     * @throw {Error} when the type element cannot be deserialized by any type deserializer
     * @throw {Error} when a type deserializer throws an error
     */
    deserializeType: function (element, xpath) {
      for (var i = 0; i < this._typeDeserializers.length; i += 1) {
        var c = this._typeDeserializers[i];
        var t = c.deserializeElement(element, this, xpath);
        if (t) {
          return t;
        }
      }
      throw new Error("cannot deserialize type element " +
        "{" + element.namespaceURI + "}" + element.localName);
    },

    /**
     * @throw {Error} when the type element cannot be resolved by any type deserializer
     * @throw {Error} when a type deserializer throws an error
     */
    resolveNamedType: function (qname) {
      for (var i = 0; i < this._typeDeserializers.length; i += 1) {
        var c = this._typeDeserializers[i];
        var t = c.resolveQualifiedName(qname);
        if (t) {
          return t;
        }
      }
      throw new Error("cannot resolve type " + qname);
    },

    /**
     * Check if an element would create a recursive type when passed to
     * #deserializeElement().
     *
     * @param {Element} element an XML Schema element declaration
     *
     * @return {false} when the element does not reference another element, or
     *   does not cause a recursion
     * @return {true} when the element references an element whose deserialization
     *   has not yet been completed
     */
    isRecursiveElement: function (element) {
      if (!element.hasAttribute('ref')) {
        return false;
      }
      var refName = element.getAttribute('ref');
      return this._referenceStack.indexOf(refName) !== -1;
    },

    /**
     * Deserialize an element and its type.
     *
     * Does not resolve attribute "subsitutionGroup".
     *
     * @param {Element} element an XML Schema element declaration
     * @param {sulfur/util/xpath} xpath
     *
     * @return {sulfur/schema/element}
     *
     * @throw {Error} when the type declaration cannot be resolved
     * @throw {Error} when the type is recursive
     */
    deserializeElement: function (element, xpath) {
      var name;
      var type;
      if (element.hasAttribute('ref')) {
        var refName = element.getAttribute('ref');
        if (this._referenceStack.indexOf(refName) !== -1) {
          throw new Error("recursive element type");
        }
        this._referenceStack.push(refName);
        var ref = xpath.first('/xs:schema/xs:element[@name = "' + refName + '"]', undefined, NS);
        ref = this.deserializeElement(ref, xpath);
        type = ref.getType();
        name = ref.getName();
        this._referenceStack.pop();
      } else {
        name = element.getAttribute('name');
        if (element.hasAttribute('type')) {
          var typeName = element.getAttribute('type');
          var globalType = this.resolveGlobalType(typeName, xpath);
          if (globalType) {
            type = globalType;
          } else {
            var qname = this.resolveQualifiedName(typeName, element);
            type = this.resolveNamedType(qname);
          }
        } else {
          var child = xpath.first('xs:complexType|xs:simpleType', element, NS);
          type = this.deserializeType(child, xpath);
        }
      }
      var optional = element.getAttribute('minOccurs') === '0';
      return Element.create(name, type, { optional: optional });
    },

    resolveQualifiedName: function (qname, element) {
      var p = qname.indexOf(':');
      var prefix;
      var name;
      if (p === -1) {
        prefix = '';
        name = qname;
      } else {
        prefix = qname.substr(0, p);
        name = qname.substr(p + 1);
      }
      return QName.create(name, this.resolvePrefix(prefix, element));
    },

    resolvePrefix: function (prefix, element) {
      var xmlnsAttr = 'xmlns';
      if (prefix) {
        xmlnsAttr += ':' + prefix;
      }
      do {
        if (element.hasAttribute(xmlnsAttr)) {
          return element.getAttribute(xmlnsAttr);
        }
        element = element.parentElement;
      } while (element);
      throw new Error('cannot resolve undeclared prefix "' + prefix + '"');
    }

  });

});
