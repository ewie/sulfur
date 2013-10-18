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
  'sulfur/schema/facet/totalDigits',
  'sulfur/schema/facets',
  'sulfur/schema/qname',
  'sulfur/schema/type/simple/primitive',
  'sulfur/schema/type/simple/restricted',
  'sulfur/schema/validator/maximum',
  'sulfur/schema/validator/property'
], function (
    $shared,
    $facet,
    $totalDigitsFacet,
    $facets,
    $qname,
    $primitiveType,
    $restrictedType,
    $maximumValidator,
    $propertyValidator
) {

  'use strict';

  var expect = $shared.expect;
  var sinon = $shared.sinon;
  var bind = $shared.bind;

  describe('sulfur/schema/facet/totalDigits', function () {

    it("should be derived from sulfur/schema/facet", function () {
      expect($facet).to.be.prototypeOf($totalDigitsFacet);
    });

    describe('.getQName()', function () {

      it("should return {http://www.w3.org/2001/XMLSchema}totalDigits", function () {
        expect($totalDigitsFacet.getQName())
          .to.eql($qname.create('totalDigits', 'http://www.w3.org/2001/XMLSchema'));
      });

    });

    describe('.isShadowingLowerRestrictions()', function () {

      it("should return false", function () {
        expect($totalDigitsFacet.isShadowingLowerRestrictions()).to.be.true;
      });

    });

    describe('.getMutualExclusiveFacets()', function () {

      it("should return an empty array", function () {
        expect($totalDigitsFacet.getMutualExclusiveFacets()).to.eql([]);
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
        var spy = sandbox.spy($facet.prototype, 'initialize');
        var facet = $totalDigitsFacet.create(1);
        expect(spy).to.be.calledOn(facet).to.be.calledWith(1);
      });

      it("should reject a non-number value", function () {
        expect(bind($totalDigitsFacet, 'create', '123'))
          .to.throw("expecting a positive integer less than 2^53");
      });

      it("should reject a non-integer value", function () {
        expect(bind($totalDigitsFacet, 'create', 1.2))
          .to.throw("expecting a positive integer less than 2^53");
      });

      it("should reject a value equal to 2^53", function () {
        expect(bind($totalDigitsFacet, 'create', Math.pow(2, 53)))
          .to.throw("expecting a positive integer less than 2^53");
      });

      it("should reject a value greater than 2^53", function () {
        expect(bind($totalDigitsFacet, 'create', Math.pow(2, 54)))
          .to.throw("expecting a positive integer less than 2^53");
      });

      it("should reject a value of zero", function () {
        expect(bind($totalDigitsFacet, 'create', 0))
          .to.throw("expecting a positive integer less than 2^53");
      });

      it("should reject a negative value", function () {
        expect(bind($totalDigitsFacet, 'create', -1))
          .to.throw("expecting a positive integer less than 2^53");
      });

    });

    describe('#isRestrictionOf()', function () {

      it("should return true when the type does not define facet 'totalDigits'", function () {
        var type = $primitiveType.create({});
        var facet = $totalDigitsFacet.create(1);
        expect(facet.isRestrictionOf(type)).to.be.true;
      });

      context("when the type has effective facet 'totalDigits'", function () {

        var type;

        beforeEach(function () {
          var base = $primitiveType.create({
            facets: $facets.create([ $totalDigitsFacet ])
          });
          type = $restrictedType.create(base,
            $facets.create([ $totalDigitsFacet.create(2) ]));
        });

        it("should return true when the value is less than the type facet's value", function () {
          var facet = $totalDigitsFacet.create(1);
          expect(facet.isRestrictionOf(type)).to.be.true;
        });

        it("should return true when the value is equal to the type facet's value", function () {
          var facet = $totalDigitsFacet.create(2);
          expect(facet.isRestrictionOf(type)).to.be.true;
        });

        it("should return false when the value is greater than the type facet's value", function () {
          var facet = $totalDigitsFacet.create(3);
          expect(facet.isRestrictionOf(type)).to.be.false;
        });

      });

    });

    describe('#validate()', function () {

      it("should return true", function () {
        var facet = $totalDigitsFacet.create(1);
        expect(facet.validate()).to.be.true;
      });

    });

    describe('#createValidator()', function () {

      it("should return a validator/property with 'countDigits' and a validator/maximum", function () {
        var facet = $totalDigitsFacet.create(1);
        var v = facet.createValidator();
        expect(v).to.eql(
          $propertyValidator.create(
            'countDigits',
            $maximumValidator.create(1)
          )
        );
      });

    });

  });

});
