/*
 * Copyright (c) 2013, 2014, Erik Wienhold
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
    shared,
    Facet,
    MaxExclusiveFacet,
    MaxInclusiveFacet,
    MinExclusiveFacet,
    MinInclusiveFacet,
    Facets,
    QName,
    MinimumValidator,
    IntegerValue
) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var returns = shared.returns;

  describe('sulfur/schema/facet/minExclusive', function () {

    it("should be derived from sulfur/schema/facet", function () {
      expect(Facet).to.be.prototypeOf(MinExclusiveFacet);
    });

    describe('.qname', function () {

      it("should return {http://www.w3.org/2001/XMLSchema}minExclusive", function () {
        expect(MinExclusiveFacet.qname)
          .to.eql(QName.create('minExclusive', 'http://www.w3.org/2001/XMLSchema'));
      });

    });

    describe('.isShadowingLowerRestrictions', function () {

      it("should return false", function () {
        expect(MinExclusiveFacet.isShadowingLowerRestrictions).to.be.true;
      });

    });

    describe('.mutexFacets', function () {

      it("should return sulfur/schema/facet/minInclusive", function () {
        expect(MinExclusiveFacet.mutexFacets)
          .to.eql([ MinInclusiveFacet ]);
      });

    });

    describe('.getValueType()', function () {

      it("should return .valueType of the given object", function () {
        var type = { valueType: {} };
        expect(MinExclusiveFacet.getValueType(type)).to.equal(type.valueType);
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
        facet = MinExclusiveFacet.create(value);
      });

      it("should check the value using the validator of the given type", function () {
        var spy = sinon.spy(validator, 'validate');
        facet.isRestrictionOf(type);
        expect(spy).to.be.calledWith(sinon.match.same(value));
      });

      it("should return true when the value satisfies the validator", function () {
        validator.validate = returns(true);
        expect(facet.isRestrictionOf(type)).to.be.true;
      });

      it("should return false when the value does not satisfy the validator", function () {
        validator.validate = returns(false);
        expect(facet.isRestrictionOf(type)).to.be.false;
      });

    });

    describe('#validateAmongFacets()', function () {

      var facet;
      var facets;

      beforeEach(function () {
        facet = MinExclusiveFacet.create(IntegerValue.create());
      });

      it("should return true when valid", function () {
        var dummyFacet = { qname: QName.create('x', 'urn:example:y') };
        facets = Facets.create([ dummyFacet ]);
        expect(facet.validateAmongFacets(facets)).to.be.true;
      });

      context("with a sulfur/schema/facet/minInclusive", function () {

        beforeEach(function () {
          facets = Facets.create([ MinInclusiveFacet.create() ]);
        });

        it("should reject", function () {
          expect(facet.validateAmongFacets(facets)).to.be.false;
        });

        it("should add an error message", function () {
          var errors = [];
          facet.validateAmongFacets(facets, errors);
          expect(errors).to.include("cannot be used along with facet 'minInclusive'");
        });

      });

      context("with a value greater than sulfur/schema/facet/maxExclusive when given", function () {

        beforeEach(function () {
          facets = Facets.create([
            MaxExclusiveFacet.create(IntegerValue.parse('-1'))
          ]);
        });

        it("should reject", function () {
          expect(facet.validateAmongFacets(facets)).to.be.false;
        });

        it("should add an error message", function () {
          var errors = [];
          facet.validateAmongFacets(facets, errors);
          expect(errors).to.include("must be less than or equal to facet 'maxExclusive'");
        });

      });

      context("with a value greater than sulfur/schema/facet/maxInclusive when given", function () {

        beforeEach(function () {
          facets = Facets.create([
            MaxInclusiveFacet.create(IntegerValue.parse('-1'))
          ]);
        });

        it("should reject", function () {
          expect(facet.validateAmongFacets(facets)).to.be.false;
        });

        it("should add an error message", function () {
          var errors = [];
          facet.validateAmongFacets(facets, errors);
          expect(errors).to.include("must be less than facet 'maxInclusive'");
        });

      });

      context("with a value equal to sulfur/schema/facet/maxInclusive when given", function () {

        beforeEach(function () {
          facets = Facets.create([
            MaxInclusiveFacet.create(IntegerValue.create())
          ]);
        });

        it("should reject", function () {
          expect(facet.validateAmongFacets(facets)).to.be.false;
        });

        it("should add an error message", function () {
          var errors = [];
          facet.validateAmongFacets(facets, errors);
          expect(errors).to.include("must be less than facet 'maxInclusive'");
        });

      });

    });

    describe('#createValidator()', function () {

      it("should return a validator/minimum matching exclusively", function () {
        var facet = MinExclusiveFacet.create(0);
        var v = facet.createValidator();
        expect(v).to.eql(MinimumValidator.create(facet.value, { exclusive: true }));
      });

    });

  });

});
