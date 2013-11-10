/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/util',
  'sulfur/util/factory'
], function(util, Factory) {

  'use strict';

  var XSD_NS = 'http://www.w3.org/2001/XMLSchema';

  function createUniquePrefixFactory() {
    var counter = 0;
    return function () {
      return 'ns' + (counter += 1);
    };
  }

  return Factory.derive({

    initialize: function (typeSerializers) {
      this._typeSerializers = typeSerializers;
      this._createUniquePrefix = createUniquePrefixFactory();
    },

    hasTypeWithQualifiedName: function (qname) {
      return this._typeSerializers.some(function (typeSerializer) {
        return typeSerializer.hasTypeWithQualifiedName(qname);
      });
    },

    serializeType: function (type, context) {
      for (var i = 0; i < this._typeSerializers.length; i += 1) {
        var r = this._typeSerializers[i].serializeType(type, this, context);
        if (r) {
          return r;
        }
      }
      throw new Error("cannot serialize type");
    },

    serializeElement: function (element, context) {
      var type = element.type;
      var e = context.createElement(XSD_NS, 'xs:element');
      e.setAttribute('name', element.name);
      if (element.isOptional()) {
        e.setAttribute('minOccurs', '0');
      }
      if (element.default) {
        e.setAttribute('default', element.default);
      }
      if (type.qname) {
        var qname = type.qname;
        if (!this.hasTypeWithQualifiedName(qname)) {
          throw new Error("element of unknown type " + qname);
        }
        var prefix = context.getNamespacePrefix(qname.namespaceURI);
        e.setAttribute('type', prefix + ':' + qname.localName);
      } else {
        e.appendChild(this.serializeType(type, context));
      }
      return e;
    }

  });

});
