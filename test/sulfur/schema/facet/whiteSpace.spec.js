/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, describe, it */

define([
  'shared',
  'sulfur/schema/facet',
  'sulfur/schema/facet/whiteSpace',
  'sulfur/schema/facets',
  'sulfur/schema/qname',
  'sulfur/schema/type/simple/primitive',
  'sulfur/schema/type/simple/restricted',
  'sulfur/schema/value/simple/whiteSpace'
], function (
    shared,
    Facet,
    WhiteSpaceFacet,
    Facets,
    QName,
    PrimitiveType,
    RestrictedType,
    WhiteSpaceValue
) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var bind = shared.bind;

  describe('sulfur/schema/facet/whiteSpace', function () {

    it("should be derived from sulfur/schema/facet", function () {
      expect(Facet).to.be.prototypeOf(WhiteSpaceFacet);
    });

    describe('.qname', function () {

      it("should return {http://www.w3.org/2001/XMLSchema}whiteSpace", function () {
        expect(WhiteSpaceFacet.qname).to.eql(
          QName.create('whiteSpace', 'http://www.w3.org/2001/XMLSchema'));
      });

    });

    describe('.isShadowingLowerRestrictions', function () {

      it("should return true", function () {
        expect(WhiteSpaceFacet.isShadowingLowerRestrictions).to.be.true;
      });

    });

    describe('.mutexFacets', function () {

      it("should return an empty array", function () {
        expect(WhiteSpaceFacet.mutexFacets).to.eql([]);
      });

    });

    describe('.getValueType()', function () {

      it("should return sulfur/schema/value/simple/whiteSpace", function () {
        expect(WhiteSpaceFacet.getValueType()).to.equal(WhiteSpaceValue);
      });

    });

    describe('#initialize()', function () {

      var sandbox;

      beforeEach(function () {
        sandbox = sinon.sandbox.create();
      });

      afterEach(function () {
        sandbox.restore();
      });

      it("should reject values other than sulfur/schema/value/simple/whiteSpace", function () {
        expect(bind(WhiteSpaceFacet, 'create', {}))
          .to.throw("expecting a sulfur/schema/value/simple/whiteSpace");
      });

      it("should call sulfur/schema/facet#initialize()", function () {
        var spy = sandbox.spy(Facet.prototype, 'initialize');
        var value = WhiteSpaceValue.create('collapse');
        var facet = WhiteSpaceFacet.create(value);
        expect(spy)
          .to.be.calledOn(sinon.match.same(facet))
          .to.be.calledWith(sinon.match.same(value));
      });

    });

    describe('#isRestrictionOf()', function () {

      it("should return true when the type does not define facet 'whiteSpace'", function () {
        var type = PrimitiveType.create({});
        var facet = WhiteSpaceFacet.create(WhiteSpaceValue.create('collapse'));
        expect(facet.isRestrictionOf(type)).to.be.true;
      });

      it("should return the result of .isEqualOrStricter() when the type has effective facet 'whiteSpace'", function () {
        var ws = WhiteSpaceValue.create('collapse');
        var spy = sinon.spy(ws, 'isEqualOrStricter');
        var facet = WhiteSpaceFacet.create(ws);

        var base = PrimitiveType.create({ facets: Facets.create([ WhiteSpaceFacet ]) });

        var otherFacet = WhiteSpaceFacet.create(WhiteSpaceValue.create('preserve'));
        var type = RestrictedType.create(base, Facets.create([ otherFacet ]));

        var r = facet.isRestrictionOf(type);
        expect(spy)
          .to.be.calledWith(otherFacet.value)
          .to.have.returned(r);
      });

    });

    describe('#validateAmongFacets()', function () {

      it("should return true", function () {
        var facet = WhiteSpaceFacet.create(WhiteSpaceValue.create('collapse'));
        expect(facet.validateAmongFacets()).to.be.true;
      });

    });

    describe('#createValidator()', function () {

      it("should reject", function () {
        var facet = WhiteSpaceFacet.create(WhiteSpaceValue.create('replace'));
        expect(bind(facet, 'createValidator'))
          .to.throw("validator creation is not allowed");
      });

    });

  });

});
