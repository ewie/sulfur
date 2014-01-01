/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/type/complex/list',
  'sulfur/schema/type/complex/restricted',
  'sulfur/util',
  'sulfur/util/factory',
  'sulfur/util/stringMap'
], function (ListType, RestrictedType, util, Factory, StringMap) {

  'use strict';

  var XSD_NS = 'http://www.w3.org/2001/XMLSchema';

  return Factory.derive({

    initialize: function (types) {
      this._typeIndex = types.reduce(function (index, type) {
        var qname = type.qname;
        if (index.contains(qname)) {
          throw new Error("type with duplicate qualified name " + qname);
        }
        index.set(qname, type);
        return index;
      }, StringMap.create());
    },

    hasTypeWithQualifiedName: function (qname) {
      return this._typeIndex.contains(qname);
    },

    serializeType: (function () {

      function serializeListType(type, typeSerializer, context) {
        var e = context.createElement(XSD_NS, 'xs:sequence');

        var maxOccurs = type.maxLength;
        var minOccurs = type.minLength || 0;

        util.isUndefined(maxOccurs) && (maxOccurs = 'unbounded');

        e.setAttribute('maxOccurs', maxOccurs);
        e.setAttribute('minOccurs', minOccurs);

        var f = typeSerializer.serializeElement(type.element, context);
        e.appendChild(f);

        return e;
      }

      function serializeRestrictedType(type, typeSerializer, context) {
        var e = context.createElement(XSD_NS, 'xs:all');

        type.elements.toArray().forEach(function (element) {
          var f = typeSerializer.serializeElement(element, context);
          e.appendChild(f);
        });

        return e;
      }

      return function (type, typeSerializer, context) {
        var isList = ListType.prototype.isPrototypeOf(type);
        var isRestriction = RestrictedType.prototype.isPrototypeOf(type);

        if (!isList && !isRestriction) {
          return;
        }

        var e = context.createElement(XSD_NS, 'xs:complexType');
        var f;

        if (isList) {
          f = serializeListType(type, typeSerializer, context);
        } else {
          f = serializeRestrictedType(type, typeSerializer, context);
        }

        e.appendChild(f);

        return e;
      };

    }())

  });

});
