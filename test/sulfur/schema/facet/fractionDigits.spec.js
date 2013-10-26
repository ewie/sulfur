/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/facet',
  'sulfur/schema/facet/fractionDigits',
  'sulfur/schema/facets',
  'sulfur/schema/qname',
  'sulfur/schema/type/simple/primitive',
  'sulfur/schema/type/simple/restricted',
  'sulfur/schema/validator/maximum',
  'sulfur/schema/validator/property'
], function (
    shared,
    Facet,
    FractionDigitsFacet,
    Facets,
    QName,
    PrimitiveType,
    RestrictedType,
    MaximumValidator,
    PropertyValidator
) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var bind = shared.bind;

  describe('sulfur/schema/facet/fractionDigits', function () {

    it("should be derived from sulfur/schema/facet", function () {
      expect(Facet).to.be.prototypeOf(FractionDigitsFacet);
    });

    describe('.qname', function () {

      it("should return {http://www.w3.org/2001/XMLSchema}fractionDigits", function () {
        expect(FractionDigitsFacet.qname)
          .to.eql(QName.create('fractionDigits',
            'http://www.w3.org/2001/XMLSchema'));
      });

    });

    describe('.isShadowingLowerRestrictions()', function () {

      it("should return true", function () {
        expect(FractionDigitsFacet.isShadowingLowerRestrictions()).to.be.true;
      });

    });

    describe('.mutualExclusiveFacets', function () {

      it("should return an empty array", function () {
        expect(FractionDigitsFacet.mutualExclusiveFacets).to.eql([]);
      });

    });

    describe('#initialize', function () {

      var sandbox;

      beforeEach(function () {
        sandbox = sinon.sandbox.create();
      });

      afterEach(function () {
        sandbox.restore();
      });

      it("should call sulfur/schema/facet#initialize()", function () {
        var spy = sandbox.spy(Facet.prototype, 'initialize');
        var facet = FractionDigitsFacet.create(0);
        expect(spy).to.be.calledOn(facet).to.be.calledWith(0);
      });

      it("should reject a non-number value", function () {
        expect(bind(FractionDigitsFacet, 'create', '123'))
          .to.throw("expecting a non-negative integer less than 2^53");
      });

      it("should reject a non-integer value", function () {
        expect(bind(FractionDigitsFacet, 'create', 1.2))
          .to.throw("expecting a non-negative integer less than 2^53");
      });

      it("should reject a value equal to 2^53", function () {
        expect(bind(FractionDigitsFacet, 'create', Math.pow(2, 53)))
          .to.throw("expecting a non-negative integer less than 2^53");
      });

      it("should reject a value greater than 2^53", function () {
        expect(bind(FractionDigitsFacet, 'create', Math.pow(2, 54)))
          .to.throw("expecting a non-negative integer less than 2^53");
      });

      it("should reject a negative value", function () {
        expect(bind(FractionDigitsFacet, 'create', -1))
          .to.throw("expecting a non-negative integer less than 2^53");
      });

    });

    describe('#isRestrictionOf()', function () {

      it("should return true when the type does not define facet 'fractionDigits'", function () {
        var type = PrimitiveType.create({});
        var facet = FractionDigitsFacet.create(0);
        expect(facet.isRestrictionOf(type)).to.be.true;
      });

      context("when the type has effective facet 'fractionDigits'", function () {

        var type;

        beforeEach(function () {
          var base = PrimitiveType.create({
            facets: Facets.create([ FractionDigitsFacet ])
          });
          type = RestrictedType.create(base,
            Facets.create([ FractionDigitsFacet.create(1) ]));
        });

        it("should return true when the value is less than the type facet's value", function () {
          var facet = FractionDigitsFacet.create(0);
          expect(facet.isRestrictionOf(type)).to.be.true;
        });

        it("should return true when the value is equal to the type facet's value", function () {
          var facet = FractionDigitsFacet.create(1);
          expect(facet.isRestrictionOf(type)).to.be.true;
        });

        it("should return false when the value is greater than the type facet's value", function () {
          var facet = FractionDigitsFacet.create(2);
          expect(facet.isRestrictionOf(type)).to.be.false;
        });

      });

    });

    describe('#validate()', function () {

      it("should return true", function () {
        var facet = FractionDigitsFacet.create(0);
        expect(facet.validate()).to.be.true;
      });

    });

    describe('#createValidator()', function () {

      it("should return a validator/property with 'countFractionDigits' and a validator/maximum", function () {
        var facet = FractionDigitsFacet.create(0);
        var v = facet.createValidator();
        expect(v).to.eql(
          PropertyValidator.create(
            'countFractionDigits',
            MaximumValidator.create(0)
          )
        );
      });

    });

  });

});
