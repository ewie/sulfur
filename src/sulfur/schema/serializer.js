/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/serializer/context',
  'sulfur/util/document',
  'sulfur/util/factory'
], function (Context, Document, Factory) {

  'use strict';

  var XSD_NS = 'http://www.w3.org/2001/XMLSchema';

  return Factory.derive({

    /**
     * @param {sulfur/schema/serializer/type} typeSerializer
     */
    initialize: function (typeSerializer) {
      this._typeSerializer = typeSerializer;
    },

    /**
     * @param {sulfur/schema} schema
     *
     * @return {Document}
     */
    serialize: function (schema) {
      var doc = Document.make(XSD_NS, 'xs:schema', null);
      doc.root.setAttribute('targetNamespace', schema.qname.namespaceURI);
      doc.root.setAttribute('elementFormDefault', 'qualified');
      doc.root.setAttribute('attributeFormDefault', 'unqualified');

      var root = doc.createElement(XSD_NS, 'xs:element');
      root.setAttribute('name', schema.qname.localName);
      doc.root.appendChild(root);

      var complexType = doc.createElement(XSD_NS, 'xs:complexType');
      root.appendChild(complexType);

      var all = doc.createElement(XSD_NS, 'xs:all');
      complexType.appendChild(all);

      var context = Context.create(doc);

      schema.elements.toArray().forEach(function (element) {
        var e = this._typeSerializer.serializeElement(element, context);
        all.appendChild(e);
      }.bind(this));

      return doc.document;
    }

  });

});
