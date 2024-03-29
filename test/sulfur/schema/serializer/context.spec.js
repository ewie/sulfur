/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, describe, it */

define([
  'shared',
  'sulfur/schema/serializer/context',
  'sulfur/util/document'
], function (shared, Context, Document) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;

  describe('sulfur/schema/serializer/context', function () {

    describe('#createElement()', function () {

      it("should delegate to the document's .createElement()", function () {
        var doc = Document.make('urn:example:x', 'x:y');
        var spy = sinon.spy(doc, 'createElement');
        var context = Context.create(doc, doc.root);
        var element = context.createElement('urn:example:foo', 'foo:bar');
        expect(spy)
          .to.be.calledWith('urn:example:foo', 'foo:bar')
          .to.have.returned(element);
      });

    });

    describe('#getNamespacePrefix()', function () {

      var doc;

      beforeEach(function () {
        doc = Document.make('urn:example:x', 'x:y');
      });

      it("should return the namespace prefix when a prefix is associated with the given namespace URI", function () {
        var spy = sinon.spy(doc, 'lookupPrefix');
        var context = Context.create(doc);
        var prefix = context.getNamespacePrefix('urn:example:x');
        expect(spy)
          .to.be.calledWith('urn:example:x')
          .to.have.returned(prefix);
      });

      it("should declare the namespace on the document's root element when no prefix is associated", function () {
        var declareSpy = sinon.spy(doc, 'declareNamespace');
        var context = Context.create(doc);
        var prefix = context.getNamespacePrefix('urn:example:y');
        expect(declareSpy)
          .to.be.calledWith(
            'urn:example:y',
            prefix,
            sinon.match.same(doc.root));
        expect(prefix).to.equal('ns1');
      });

      it("should use a unique prefix", function () {
        var context = Context.create(doc);
        context.getNamespacePrefix('urn:example:y');
        var prefix = context.getNamespacePrefix('urn:example:z');
        expect(prefix).to.equal('ns2');
      });

    });

  });

});
