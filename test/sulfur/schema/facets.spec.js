/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, describe, it */

define([
  'shared',
  'sulfur/schema/facets',
  'sulfur/schema/qname'
], function (shared, Facets, QName) {

  'use strict';

  var expect = shared.expect;
  var bind = shared.bind;

  describe('sulfur/schema/facets', function () {

    describe('#initialize()', function () {

      it("should initialize the facets", function () {
        var fs = [
          { qname: QName.create('x', 'urn:z') }
        ];
        var facets = Facets.create(fs);
        expect(facets.toArray()).to.eql(fs);
      });

      it("should reject an empty array of elements", function () {
        expect(bind(Facets, 'create', []))
          .to.throw("expecting one or more facets");
      });

      it("should reject facets with duplicate qualified name", function () {
        var fs = [
          { qname: QName.create('x', 'urn:y') },
          { qname: QName.create('x', 'urn:y') }
        ];
        expect(bind(Facets, 'create', fs))
          .to.throw("facet with duplicate qualified name {urn:y}x");
      });

    });

    describe('#hasByQName()', function () {

      var facet;
      var facets;

      beforeEach(function () {
        facet = { qname: QName.create('foo', 'urn:bar') };
        facets = Facets.create([ facet ]);
      });

      it("should return true when a facet with the given qualified name is defined", function () {
        expect(facets.hasByQName(QName.create('foo', 'urn:bar'))).to.be.true;
      });

      it("should return false when no facet with the given qualified name is defined", function () {
        expect(facets.hasByQName(QName.create('bar', 'urn:foo'))).to.be.false;
      });

    });

    describe('#getByQName()', function () {

      var facet;
      var facets;

      beforeEach(function () {
        facet = { qname: QName.create('foo', 'urn:bar') };
        facets = Facets.create([ facet ]);
      });

      it("should return the facet when defined", function () {
        expect(facets.getByQName(QName.create('foo', 'urn:bar'))).to.equal(facet);
      });

      it("should return undefined when no facet with the given qualified name is defined", function () {
        expect(facets.getByQName(QName.create('bar', 'urn:foo'))).to.be.undefined;
      });

    });

    describe('#size', function () {

      it("should return the number of facets", function () {
        var fs = [
          { qname: QName.create('x', 'urn:z') }
        ];
        var facets = Facets.create(fs);
        expect(facets.size).to.equal(1);
      });

    });

    describe('#toArray()', function () {

      it("should return the facets in initialization order", function () {
        var fs = [
          { qname: QName.create('x', 'urn:z') },
          { qname: QName.create('y', 'urn:z') }
        ];
        var facets = Facets.create(fs);
        expect(facets.toArray()).to.eql(fs);
      });

    });

  });

});
