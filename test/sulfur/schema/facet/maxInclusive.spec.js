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
  'sulfur/schema/validator/maximum',
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
    MaximumValidator,
    IntegerValue
) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var returns = shared.returns;

  describe('sulfur/schema/facet/maxInclusive', function () {

    it("should be derived from sulfur/schema/facet", function () {
      expect(Facet).to.be.prototypeOf(MaxInclusiveFacet);
    });

    describe('.qname', function () {

      it("should return {http://www.w3.org/2001/XMLSchema}maxInclusive", function () {
        expect(MaxInclusiveFacet.qname)
          .to.eql(QName.create('maxInclusive', 'http://www.w3.org/2001/XMLSchema'));
      });

    });

    describe('.isShadowingLowerRestrictions', function () {

      it("should return true", function () {
        expect(MaxInclusiveFacet.isShadowingLowerRestrictions).to.be.true;
      });

    });

    describe('.mutexFacets', function () {

      it("should return sulfur/schema/facet/maxExclusive", function () {
        expect(MaxInclusiveFacet.mutexFacets)
          .to.eql([ MaxExclusiveFacet ]);
      });

    });

    describe('.getValueType()', function () {

      it("should return .valueType of the given object", function () {
        var type = { valueType: {} };
        expect(MaxInclusiveFacet.getValueType(type)).to.equal(type.valueType);
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
        facet = MaxInclusiveFacet.create(value);
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
        facet = MaxInclusiveFacet.create(IntegerValue.create());
      });

      it("should return true when valid", function () {
        var dummyFacet = { qname: QName.create('x', 'urn:example:y') };
        facets = Facets.create([ dummyFacet ]);
        expect(facet.validateAmongFacets(facets)).to.be.true;
      });

      context("with a sulfur/schema/facet/maxExclusive", function () {

        beforeEach(function () {
          facets = Facets.create([ MaxExclusiveFacet.create() ]);
        });

        it("should reject", function () {
          expect(facet.validateAmongFacets(facets)).to.be.false;
        });

        it("should add an error message", function () {
          var errors = [];
          facet.validateAmongFacets(facets, errors);
          expect(errors).to.include("cannot be used along with facet 'maxExclusive'");
        });

      });

      context("with a value less than sulfur/schema/facet/minExclusive when given", function () {

        beforeEach(function () {
          facets = Facets.create([
            MinExclusiveFacet.create(IntegerValue.parse('2'))
          ]);
        });

        it("should reject", function () {
          expect(facet.validateAmongFacets(facets)).to.be.false;
        });

        it("should add an error message", function () {
          var errors = [];
          facet.validateAmongFacets(facets, errors);
          expect(errors).to.include("must be greater than facet 'minExclusive'");
        });

      });

      context("with a value equal to sulfur/schema/facet/minExclusive when given", function () {

        beforeEach(function () {
          facets = Facets.create([
            MinExclusiveFacet.create(IntegerValue.create())
          ]);
        });

        it("should reject", function () {
          expect(facet.validateAmongFacets(facets)).to.be.false;
        });

        it("should add an error message", function () {
          var errors = [];
          facet.validateAmongFacets(facets, errors);
          expect(errors).to.include("must be greater than facet 'minExclusive'");
        });

      });

      context("with a value less than sulfur/schema/facet/minInclusive when given", function () {

        beforeEach(function () {
          facets = Facets.create([
            MinInclusiveFacet.create(IntegerValue.parse('2'))
          ]);
        });

        it("should reject", function () {
          expect(facet.validateAmongFacets(facets)).to.be.false;
        });

        it("should add an error message", function () {
          var errors = [];
          facet.validateAmongFacets(facets, errors);
          expect(errors).to.include("must be greater than or equal to facet 'minInclusive'");
        });

      });

    });

    describe('#createValidator()', function () {

      it("should return a validator/maximum matching inclusively", function () {
        var facet = MaxInclusiveFacet.create(0);
        var v = facet.createValidator();
        expect(v).to.eql(
          MaximumValidator.create(facet.value)
        );
      });

    });

  });

});
