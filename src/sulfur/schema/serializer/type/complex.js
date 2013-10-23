/* Copyright (c) 2013, Erik Wienhold
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
  'sulfur/util/orderedMap'
], function (ListType, RestrictedType, util, Factory, OrderedMap) {

  'use strict';

  var XSD_NS = 'http://www.w3.org/2001/XMLSchema';

  var keyfn = util.method('getQName');

  return Factory.derive({

    initialize: function (types) {
      this._typeIndex = types.reduce(function (index, type) {
        var qname = type.getQName();
        if (index.containsKey(qname)) {
          throw new Error("type with duplicate qualified name " + qname);
        }
        index.insert(type);
        return index;
      }, OrderedMap.create(keyfn));
    },

    hasTypeWithQualifiedName: function (qname) {
      return this._typeIndex.containsKey(qname);
    },

    serializeType: (function () {

      function serializeListType(type, typeSerializer, context) {
        var e = context.createElement(XSD_NS, 'xs:sequence');

        var maxOccurs = type.getMaxLength();
        var minOccurs = type.getMinLength() || 0;

        util.isUndefined(maxOccurs) && (maxOccurs = 'unbounded');

        e.setAttribute('maxOccurs', maxOccurs);
        e.setAttribute('minOccurs', minOccurs);

        var f = typeSerializer.serializeElement(type.getElement(), context);
        e.appendChild(f);

        return e;
      }

      function serializeRestrictedType(type, typeSerializer, context) {
        var e = context.createElement(XSD_NS, 'xs:all');

        type.getElements().toArray().forEach(function (element) {
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
