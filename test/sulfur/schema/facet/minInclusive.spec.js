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

  describe('sulfur/schema/facet/minInclusive', function () {

    it("should be derived from sulfur/schema/facet", function () {
      expect(Facet).to.be.prototypeOf(MinInclusiveFacet);
    });

    describe('.qname', function () {

      it("should return {http://www.w3.org/2001/XMLSchema}minInclusive", function () {
        expect(MinInclusiveFacet.qname)
          .to.eql(QName.create('minInclusive', 'http://www.w3.org/2001/XMLSchema'));
      });

    });

    describe('.isShadowingLowerRestrictions', function () {

      it("should return false", function () {
        expect(MinInclusiveFacet.isShadowingLowerRestrictions).to.be.true;
      });

    });

    describe('.mutualExclusiveFacets', function () {

      it("should return sulfur/schema/facet/minExclusive", function () {
        expect(MinInclusiveFacet.mutualExclusiveFacets)
          .to.eql([ MinExclusiveFacet ]);
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
        facet = MinInclusiveFacet.create(value);
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

    describe('#validate()', function () {

      var facet;
      var type;

      beforeEach(function () {
        facet = MinInclusiveFacet.create(IntegerValue.create());
      });

      it("should return true when valid", function () {
        var dummyFacet = { qname: QName.create('x', 'urn:example:y') };
        type = Facets.create([ dummyFacet ]);
        type.valueType = IntegerValue;
        expect(facet.validate(type)).to.be.true;
      });

      it("should return false when the value is not of the given type", function () {
        var dummyFacet = { qname: QName.create('x', 'urn:example:y') };
        type = Facets.create([ dummyFacet ]);
        type.valueType = { prototype: {} };
        expect(facet.validate(type)).to.be.false;
      });

      context("with a sulfur/schema/facet/minExclusive", function () {

        beforeEach(function () {
          type = Facets.create([ MinExclusiveFacet.create() ]);
          type.valueType = IntegerValue;
        });

        it("should reject", function () {
          expect(facet.validate(type)).to.be.false;
        });

        it("should add an error message", function () {
          var errors = [];
          facet.validate(type, errors);
          expect(errors).to.include("cannot be used along with facet 'minExclusive'");
        });

      });

      context("with a value greater than sulfur/schema/facet/maxExclusive when given", function () {

        beforeEach(function () {
          type = Facets.create([
            MaxExclusiveFacet.create(IntegerValue.parse('-1'))
          ]);
          type.valueType = IntegerValue;
        });

        it("should reject", function () {
          expect(facet.validate(type)).to.be.false;
        });

        it("should add an error message", function () {
          var errors = [];
          facet.validate(type, errors);
          expect(errors).to.include("must be less than facet 'maxExclusive'");
        });

      });

      context("with a value equal to sulfur/schema/facet/maxExclusive when given", function () {

        beforeEach(function () {
          type = Facets.create([
            MaxExclusiveFacet.create(IntegerValue.create())
          ]);
          type.valueType = IntegerValue;
        });

        it("should reject", function () {
          expect(facet.validate(type)).to.be.false;
        });

        it("should add an error message", function () {
          var errors = [];
          facet.validate(type, errors);
          expect(errors).to.include("must be less than facet 'maxExclusive'");
        });

      });

      context("with a value greater than sulfur/schema/facet/maxInclusive when given", function () {

        beforeEach(function () {
          type = Facets.create([
            MaxInclusiveFacet.create(IntegerValue.parse('-1'))
          ]);
          type.valueType = IntegerValue;
        });

        it("should reject", function () {
          expect(facet.validate(type)).to.be.false;
        });

        it("should add an error message", function () {
          var errors = [];
          facet.validate(type, errors);
          expect(errors).to.include("must be less than or equal to facet 'maxInclusive'");
        });

      });

    });

    describe('#createValidator()', function () {

      it("should return a validator/minimum matching inclusively", function () {
        var facet = MinInclusiveFacet.create(0);
        var v = facet.createValidator();
        expect(v).to.eql(MinimumValidator.create(facet.value));
      });

    });

  });

});
