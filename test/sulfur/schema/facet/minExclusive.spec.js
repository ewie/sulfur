/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/facet',
  'sulfur/schema/facet/maxExclusive',
  'sulfur/schema/facet/maxInclusive',
  'sulfur/schema/facet/minExclusive',
  'sulfur/schema/facet/minInclusive',
  'sulfur/schema/facets',
  'sulfur/schema/qname',
  'sulfur/schema/validator/minimum',
  'sulfur/schema/value/simple/integer'
], function (
    $shared,
    $facet,
    $maxExclusiveFacet,
    $maxInclusiveFacet,
    $minExclusiveFacet,
    $minInclusiveFacet,
    $facets,
    $qname,
    $minimumValidator,
    $integerValue
) {

  'use strict';

  var expect = $shared.expect;
  var sinon = $shared.sinon;
  var returns = $shared.returns;

  describe('sulfur/schema/facet/minExclusive', function () {

    it("should be derived from sulfur/schema/facet", function () {
      expect($facet).to.be.prototypeOf($minExclusiveFacet);
    });

    describe('.getQName()', function () {

      it("should return {http://www.w3.org/2001/XMLSchema}minExclusive", function () {
        expect($minExclusiveFacet.getQName())
          .to.eql($qname.create('minExclusive', 'http://www.w3.org/2001/XMLSchema'));
      });

    });

    describe('.isShadowingLowerRestrictions()', function () {

      it("should return false", function () {
        expect($minExclusiveFacet.isShadowingLowerRestrictions()).to.be.true;
      });

    });

    describe('.getMutualExclusiveFacets()', function () {

      it("should return sulfur/schema/facet/minInclusive", function () {
        expect($minExclusiveFacet.getMutualExclusiveFacets())
          .to.eql([ $minInclusiveFacet ]);
      });

    });

    describe('#isRestrictionOf()', function () {

      var facet;
      var validator;
      var value;
      var type;

      beforeEach(function () {
        validator = { validate: function () {} };
        type = { createValidator: returns(validator) };
        value = {};
        facet = $minExclusiveFacet.create(value);
      });

      it("should check the value using the validator of the given type", function () {
        var spy = sinon.spy(validator, 'validate');
        facet.isRestrictionOf(type);
        expect(spy).to.be.calledWith(sinon.match.same(value));
      });

      it("should return true when the value satisfies the validator", function () {
        sinon.stub(validator, 'validate').returns(true);
        expect(facet.isRestrictionOf(type)).to.be.true;
      });

      it("should return false when the value does not satisfy the validator", function () {
        sinon.stub(validator, 'validate').returns(false);
        expect(facet.isRestrictionOf(type)).to.be.false;
      });

    });

    describe('#validate()', function () {

      var facet;
      var type;

      beforeEach(function () {
        facet = $minExclusiveFacet.create($integerValue.create());
      });

      it("should return true when valid", function () {
        var dummyFacet = { getQName: returns($qname.create('x', 'urn:y')) };
        type = $facets.create([ dummyFacet ]);
        type.getValueType = function () { return $integerValue; };
        expect(facet.validate(type)).to.be.true;
      });

      it("should return false when the value is not of the given type", function () {
        var dummyFacet = { getQName: returns($qname.create('x', 'urn:y')) };
        type = $facets.create([ dummyFacet ]);
        type.getValueType = function () { return { prototype: {} }; };
        expect(facet.validate(type)).to.be.false;
      });

      context("with a sulfur/schema/facet/minInclusive", function () {

        beforeEach(function () {
          type = $facets.create([ $minInclusiveFacet.create() ]);
          type.getValueType = function () { return $integerValue; };
        });

        it("should reject", function () {
          expect(facet.validate(type)).to.be.false;
        });

        it("should add an error message", function () {
          var errors = [];
          facet.validate(type, errors);
          expect(errors).to.include("cannot be used along with facet 'minInclusive'");
        });

      });

      context("with a value greater than sulfur/schema/facet/maxExclusive when given", function () {

        beforeEach(function () {
          type = $facets.create([
            $maxExclusiveFacet.create($integerValue.parse('-1'))
          ]);
          type.getValueType = function () { return $integerValue; };
        });

        it("should reject", function () {
          expect(facet.validate(type)).to.be.false;
        });

        it("should add an error message", function () {
          var errors = [];
          facet.validate(type, errors);
          expect(errors).to.include("must be less than or equal to facet 'maxExclusive'");
        });

      });

      context("with a value greater than sulfur/schema/facet/maxInclusive when given", function () {

        beforeEach(function () {
          type = $facets.create([
            $maxInclusiveFacet.create($integerValue.parse('-1'))
          ]);
          type.getValueType = function () { return $integerValue; };
        });

        it("should reject", function () {
          expect(facet.validate(type)).to.be.false;
        });

        it("should add an error message", function () {
          var errors = [];
          facet.validate(type, errors);
          expect(errors).to.include("must be less than facet 'maxInclusive'");
        });

      });

      context("with a value equal to sulfur/schema/facet/maxInclusive when given", function () {

        beforeEach(function () {
          type = $facets.create([
            $maxInclusiveFacet.create($integerValue.create())
          ]);
          type.getValueType = function () { return $integerValue; };
        });

        it("should reject", function () {
          expect(facet.validate(type)).to.be.false;
        });

        it("should add an error message", function () {
          var errors = [];
          facet.validate(type, errors);
          expect(errors).to.include("must be less than facet 'maxInclusive'");
        });

      });

    });

    describe('#createValidator()', function () {

      it("should return a validator/minimum matching exclusively", function () {
        var facet = $minExclusiveFacet.create(0);
        var v = facet.createValidator();
        expect(v).to.eql($minimumValidator.create(facet.getValue(), { exclusive: true }));
      });

    });

  });

});
