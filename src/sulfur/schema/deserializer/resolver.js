/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/factory',
  'sulfur/schema/qname'
], function ($factory, $qname) {

  'use strict';

  var NS = { xs: 'http://www.w3.org/2001/XMLSchema' };

  return $factory.derive({

    /**
     * @param [array] typeResolvers an array of type resolvers used in the
     *   given order
     * @param [sulfur/util/xpath] xpath
     */
    initialize: function (typeResolvers, xpath) {
      this._typeResolvers = typeResolvers;
      this._xpath = xpath;
    },

    /**
     * @return [sulfur/util/xpath]
     */
    getXPath: function () {
      return this._xpath;
    },

    resolveGlobalType: function (name) {
      var expr = '(/xs:schema/xs:simpleType|/xs:schema/xs:complexType)' +
        '[@name = "' + name + '"]';
      var element = this._xpath.first(expr, undefined, NS);
      if (element) {
        return this.resolveTypeElement(element);
      }
    },

    /**
     * @throw [Error] when the type element cannot be resolved by any converter
     * @throw [Error] when a converter throws an error
     */
    resolveTypeElement: function (element) {
      for (var i = 0; i < this._typeResolvers.length; i += 1) {
        var c = this._typeResolvers[i];
        var t = c.resolveElement(element, this);
        if (t) {
          return t;
        }
      }
      throw new Error("cannot resolve type element " +
        "{" + element.namespaceURI + "}" + element.localName);
    },

    /**
     * @throw [Error] when the type element cannot be resolved by any converter
     * @throw [Error] when a converter throws an error
     */
    resolveNamedType: function (qname) {
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
     * Resolve an element type either by resolving attribute "type" or by
     * resolving child xs:simpleType or xs:complexType, whichever is defined.
     *
     * Does not resolve attribute "ref" nor "subsitutionGroup".
     *
     * @param [Element] element an xs:element
     *
     * @return [object]
     *
     * @throw [Error] when the type declaration is no supported
     * @throw [Error] when the type declaration cannot be resolved
     */
    resolveElementType: function (element) {
      if (element.hasAttribute('type')) {
        var typeName = element.getAttribute('type');
        var globalType = this.resolveGlobalType(typeName);
        if (globalType) {
          return globalType;
        }
        var qname = this.resolveQualifiedName(typeName, element);
        return this.resolveNamedType(qname);
      }
      var type = this._xpath.first('xs:complexType|xs:simpleType', element, NS);
      if (type) {
        return this.resolveTypeElement(type);
      }
      throw new Error("element with unsupported type declaration");
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
      return $qname.create(name, this.resolvePrefix(prefix, element));
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
