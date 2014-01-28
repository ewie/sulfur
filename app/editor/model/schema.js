/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'app/editor/collection/elements',
  'app/editor/model/element',
  'sulfur/schema',
  'sulfur/schema/element',
  'sulfur/schema/elements',
  'sulfur/schema/qname',
  'sulfur/schema/value/simple/uri',
  'sulfur/ui/model'
], function (
    ElementsCollection,
    ElementModel,
    Schema,
    Element,
    Elements,
    QName,
    UriValue,
    Model
) {

  'use strict';

  return Model.clone({

    attributes: {
      name: { default: '' },
      namespace: { default: '' },
      elements: { default: function () { return ElementsCollection.create() } }
    },

    _extract: function (schema) {
      var elements = schema.elements.toArray().map(function (e) {
        return ElementModel.createFromObject(e);
      });
      return {
        name: schema.qname.localName,
        namespace: schema.qname.namespaceURI,
        elements: ElementsCollection.create(elements)
      };
    }

  }).augment({

    _validate: function (errors) {
      Model.prototype._validate.call(this, errors);
      var name = this.get('name');
      if (name) {
        Element.isValidName(name) || (errors.name = "must be a valid NCName");
      } else {
        errors.name = "must not be empty";
      }
      var namespace = this.get('namespace');
      if (namespace) {
        UriValue.isValidLiteral(namespace) || (errors.namespace = "must be a valid URI");
      } else {
        errors.namespace = "must not be empty";
      }
      var elements = this.get('elements');
      (elements.size === 0) && (errors.elements = true);
    },

    _construct: function () {
      var elements = this.get('elements');
      if (elements.size === 0 || !elements.isValid()) {
        return;
      }
      elements = Elements.create(elements.items.map(function (m) {
        return m.object;
      }));
      var qname = QName.create(this.get('name'), this.get('namespace'));
      return Schema.create(qname, elements);
    }

  });

});
