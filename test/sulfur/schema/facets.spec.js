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
], function ($shared, $facets, $qname) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;
  var returns = $shared.returns;

  describe('sulfur/schema/facets', function () {

    describe('#initialize()', function () {

      it("should initialize the facets", function () {
        var fs = [
          { getQName: returns($qname.create('x', 'urn:z')) }
        ];
        var facets = $facets.create(fs);
        expect(facets.toArray()).to.eql(fs);
      });

      it("should reject an empty array of elements", function () {
        expect(bind($facets, 'create', []))
          .to.throw("expecting one or more facets");
      });

      it("should reject facets with duplicate qualified name", function () {
        var fs = [
          { getQName: returns($qname.create('x', 'urn:y')) },
          { getQName: returns($qname.create('x', 'urn:y')) }
        ];
        expect(bind($facets, 'create', fs))
          .to.throw("facet with duplicate qualified name {urn:y}x");
      });

    });

    describe('#hasFacet()', function () {

      var facet;
      var facets;

      beforeEach(function () {
        facet = { getQName: returns($qname.create('foo', 'urn:bar')) };
        facets = $facets.create([ facet ]);
      });

      it("should return true when a facet with the given qualified name is defined", function () {
        expect(facets.hasFacet($qname.create('foo', 'urn:bar'))).to.be.true;
      });

      it("should return false when no facet with the given qualified name is defined", function () {
        expect(facets.hasFacet($qname.create('bar', 'urn:foo'))).to.be.false;
      });

    });

    describe('#getFacet()', function () {

      var facet;
      var facets;

      beforeEach(function () {
        facet = { getQName: returns($qname.create('foo', 'urn:bar')) };
        facets = $facets.create([ facet ]);
      });

      it("should return the facet when defined", function () {
        expect(facets.getFacet($qname.create('foo', 'urn:bar'))).to.equal(facet);
      });

      it("should return undefined when no facet with the given qualified name is defined", function () {
        expect(facets.getFacet($qname.create('bar', 'urn:foo'))).to.be.undefined;
      });

    });

    describe('#getSize()', function () {

      it("should return the number of facets", function () {
        var fs = [
          { getQName: returns($qname.create('x', 'urn:z')) }
        ];
        var facets = $facets.create(fs);
        expect(facets.getSize()).to.equal(1);
      });

    });

    describe('#toArray()', function () {

      it("should return the facets in initialization order", function () {
        var fs = [
          { getQName: returns($qname.create('x', 'urn:z')) },
          { getQName: returns($qname.create('y', 'urn:z')) }
        ];
        var facets = $facets.create(fs);
        expect(facets.toArray()).to.eql(fs);
      });

    });

  });

});
