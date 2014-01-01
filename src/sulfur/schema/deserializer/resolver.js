/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/element',
  'sulfur/schema/qname',
  'sulfur/util/factory',
  'sulfur/util/xpath'
], function (Element, QName, Factory, XPath) {

  'use strict';

  var NS = { xs: 'http://www.w3.org/2001/XMLSchema' };

  return Factory.derive({

    /**
     * @param {array} typeResolvers an array of type resolvers used in
     *   the given order
     */
    initialize: function (document, typeResolvers) {
      this._document = document;
      this._targetNamespace = document.documentElement.getAttribute('targetNamespace');
      this._typeResolvers = typeResolvers;
      this._referenceStack = [];
    },

    /**
     * @throw {Error} when the type element cannot be resolved by any type resolver
     * @throw {Error} when a type resolver throws an error
     */
    resolveTypeElement: function (element) {
      for (var i = 0; i < this._typeResolvers.length; i += 1) {
        var c = this._typeResolvers[i];
        var t = c.resolveTypeElement(element, this);
        if (t) {
          return t;
        }
      }
      throw new Error("cannot resolve type element " +
        "{" + element.namespaceURI + "}" + element.localName);
    },

    /**
     * @throw {Error} when the type element cannot be resolved by any type resolver
     * @throw {Error} when a type resolver throws an error
     */
    resolveNamedType: function (qname) {
      if (qname.namespaceURI === this._targetNamespace) {
        var xpath = XPath.create(this._document);
        var expr = '(/xs:schema/xs:simpleType|/xs:schema/xs:complexType)' +
          '[@name = "' + qname.localName + '"]';
        var element = xpath.first(expr, undefined, NS);
        if (element) {
          return this.resolveTypeElement(element);
        }
      }
      for (var i = 0; i < this._typeResolvers.length; i += 1) {
        var c = this._typeResolvers[i];
        var t = c.resolveQualifiedName(qname);
        if (t) {
          return t;
        }
      }
      throw new Error("cannot resolve type " + qname);
    },

    /**
     * Check if an element would create a recursive type when passed to
     * #resolveElementDeclaration().
     *
     * @param {Element} element an XML Schema element declaration
     *
     * @return {false} when the element does not reference another element, or
     *   does not cause a recursion
     * @return {true} when the element references an element whose deserialization
     *   has not yet been completed
     */
    isRecursiveElementDeclaration: function (element) {
      if (!element.hasAttribute('ref')) {
        return false;
      }
      var refName = element.getAttribute('ref');
      return this._referenceStack.indexOf(refName) !== -1;
    },

    /**
     * Resolve an element declaration.
     *
     * Does not resolve attribute "subsitutionGroup".
     *
     * @param {Element} element an XML Schema element declaration
     *
     * @return {sulfur/schema/element}
     *
     * @throw {Error} when the type declaration cannot be resolved
     * @throw {Error} when the type is recursive
     */
    resolveElementDeclaration: function (element) {
      var xpath = XPath.create(element);
      var name;
      var type;
      if (element.hasAttribute('ref')) {
        var refName = element.getAttribute('ref');
        if (this._referenceStack.indexOf(refName) !== -1) {
          throw new Error("recursive element type");
        }
        this._referenceStack.push(refName);
        var ref = xpath.first('/xs:schema/xs:element[@name = "' + refName + '"]', undefined, NS);
        ref = this.resolveElementDeclaration(ref);
        type = ref.type;
        name = ref.name;
        this._referenceStack.pop();
      } else {
        name = element.getAttribute('name');
        if (element.hasAttribute('type')) {
          var typeName = element.getAttribute('type');
          var qname = this.resolveQualifiedName(typeName, element);
          type = this.resolveNamedType(qname);
        } else {
          var child = xpath.first('xs:complexType|xs:simpleType', element, NS);
          type = this.resolveTypeElement(child);
        }
      }
      var optional = element.getAttribute('minOccurs') === '0';
      var defaultValue;
      if (element.hasAttribute('default')) {
        var s = element.getAttribute('default');
        defaultValue = type.valueType.parse(s);
      }
      return Element.create(name, type, {
        optional: optional,
        default: defaultValue
      });
    },

    resolveQualifiedName: function (qname, element) {
      var p = qname.indexOf(':');
      var prefix;
      var localName;
      if (p === -1) {
        prefix = '';
        localName = qname;
      } else {
        prefix = qname.substr(0, p);
        localName = qname.substr(p + 1);
      }
      var namespaceURI = this.resolvePrefix(prefix, element);
      if (!namespaceURI) {
        if (!prefix) {
          namespaceURI = null;
        } else {
          throw new Error('cannot resolve prefix "' + prefix + '"');
        }
      }
      return QName.create(localName, namespaceURI);
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
    }

  });

});
