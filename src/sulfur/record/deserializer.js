/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/dataGridService',
  'sulfur/record',
  'sulfur/util/factory'
], function (DataGridService, Record, Factory) {

  'use strict';

  function deserializeValue(element, type, ns) {
    var valueType = type.valueType;
    if (typeof valueType.parse === 'function') {
      return valueType.parse(element.textContent);
    } else if (valueType.allowedElements) {
      return deserializeComplexValue(element, type, ns);
    } else if (type.element) {
      return deserializeComplexListValue(element, type, ns);
    }
  }

  function deserializeComplexValue(element, type, ns) {
    var valueType = type.valueType;
    var values = Array.prototype.map.call(element.children, function (e) {
      if (e.namespaceURI !== ns) {
        throw new Error("unexpected element {" + e.namespaceURI + "}" + e.localName);
      }
      var name = e.localName;
      var allowedElement = valueType.allowedElements.getByName(name);
      if (!allowedElement) {
        throw new Error("unexpected element {" + e.namespaceURI + "}" + e.localName);
      }
      var value = deserializeValue(e, allowedElement.type, ns);
      return [ name, value ];
    });
    return valueType.create(values);
  }

  function deserializeComplexListValue(element, type, ns) {
    var itemType = type.element.type;
    var itemName = type.element.name;
    var values = Array.prototype.map.call(element.children, function (e) {
      if (e.namespaceURI !== ns || e.localName !== itemName) {
        throw new Error("unexpected element {" + e.namespaceURI + "}" + e.localName);
      }
      return deserializeValue(e, itemType, ns);
    });
    return type.valueType.create(values);
  }

  return Factory.derive({

    initialize: function (schema) {
      this._schema = schema;
    },

    deserialize: function (doc) {
      var schema = this._schema;
      var qname = schema.qname;
      var ns = qname.namespaceURI;
      var root = doc.documentElement;

      if (root.namespaceURI !== ns || root.localName !== qname.localName) {
        throw new Error("record document with unexpected root element");
      }

      // .getAttributeNS() returns an empty string when the attribute is not
      // defined, in which case we fall back to undefined for consistency
      var id = root.getAttributeNS(DataGridService.namespaceURI, 'ID') || undefined;

      var values = Array.prototype.map.call(root.children, function (e) {
        if (e.namespaceURI !== qname.namespaceURI) {
          throw new Error("unexpected element {" + e.namespaceURI + "}" + e.localName);
        }
        var name = e.localName;
        var element = schema.elements.getByName(name);
        if (!element) {
          throw new Error("unexpected element {" + e.namespaceURI + "}" + e.localName);
        }
        var value = deserializeValue(e, element.type, ns);
        return [ name, value ];
      });

      return Record.create(values, id);
    }

  });

});
