/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, describe, it */

define([
  'shared',
  'sulfur/schema/qname',
  'sulfur/schema/serializer/context',
  'sulfur/schema/serializer/facet',
  'sulfur/util/document'
], function (shared, QName, Context, FacetSerializer, Document) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;

  describe('sulfur/schema/serializer/facet', function () {

    describe('#facet', function () {

      it("should return the facet", function () {
        var facet = {};
        var facetSerializer = FacetSerializer.create(facet);
        expect(facetSerializer.facet).to.equal(facet);
      });

    });

    describe('#serializeFacet()', function () {

      var ctx;

      beforeEach(function () {
        var doc = Document.make('urn:example:x', 'x:y');
        ctx = Context.create(doc);
      });

      it("should use a prefix", function () {
        var facet = { qname: QName.create('x', 'urn:example:y') };
        var obj = { value: 'z' };
        var facetSerializer = FacetSerializer.create(facet);
        var spy = sinon.spy(ctx, 'getNamespacePrefix');
        facetSerializer.serializeFacet(obj, ctx);
        expect(spy)
          .to.be.calledWith('urn:example:y')
          .to.have.returned('ns1');
      });

      it("should return an array containing a DOM element for the value when the given facet's value is not an array", function () {
        var facet = { qname: QName.create('x', 'urn:example:y') };
        var obj = { value: 'z' };
        var facetSerializer = FacetSerializer.create(facet);
        var e = facetSerializer.serializeFacet(obj, ctx);
        expect(e).to.have.lengthOf(1);
        expect(e[0].nodeName).to.equal('ns1:x');
        expect(e[0].namespaceURI).to.equal('urn:example:y');
        expect(e[0].attributes.value.value).to.equal('z');
      });

      it("should return an array with a DOM element for each value when the given facet's value is an array", function () {
        var facet = { qname: QName.create('foo', 'urn:example:bar') };
        var obj = { value: [ 'a', 'b' ] };
        var facetSerializer = FacetSerializer.create(facet);
        var e = facetSerializer.serializeFacet(obj, ctx);
        expect(e).to.have.lengthOf(2);
        expect(e[0].nodeName).to.equal('ns1:foo');
        expect(e[0].namespaceURI).to.equal('urn:example:bar');
        expect(e[0].attributes.value.value).to.equal('a');
        expect(e[1].nodeName).to.equal('ns1:foo');
        expect(e[1].namespaceURI).to.equal('urn:example:bar');
        expect(e[1].attributes.value.value).to.equal('b');
      });

    });

  });

});
