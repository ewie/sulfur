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
  'sulfur/schema/facet/length',
  'sulfur/schema/facet/maxLength',
  'sulfur/schema/facet/minLength',
  'sulfur/schema/facets',
  'sulfur/schema/qname',
  'sulfur/schema/type/simple/primitive',
  'sulfur/schema/type/simple/restricted',
  'sulfur/schema/validator/equal',
  'sulfur/schema/validator/property'
], function (
    $shared,
    $facet,
    $lengthFacet,
    $maxLengthFacet,
    $minLengthFacet,
    $facets,
    $qname,
    $primitiveType,
    $restrictedType,
    $equalValidator,
    $propertyValidator
) {

  'use strict';

  var expect = $shared.expect;
  var sinon = $shared.sinon;
  var bind = $shared.bind;
  var returns = $shared.returns;

  describe('sulfur/schema/facet/length', function () {

    it("should be derived from sulfur/schema/facet", function () {
      expect($facet).to.be.prototypeOf($lengthFacet);
    });

    describe('.getQName()', function () {

      it("should return {http://www.w3.org/2001/XMLSchema}length", function () {
        expect($lengthFacet.getQName())
          .to.eql($qname.create('length', 'http://www.w3.org/2001/XMLSchema'));
      });

    });

    describe('.isShadowingLowerRestrictions()', function () {

      it("should return true", function () {
        expect($lengthFacet.isShadowingLowerRestrictions()).to.be.true;
      });

    });

    describe('.getMutualExclusiveFacets()', function () {

      it("should return sulfur/schema/facet/maxLength and sulfur/schema/facet/minLength", function () {
        expect($lengthFacet.getMutualExclusiveFacets())
          .to.eql([ $maxLengthFacet, $minLengthFacet ]);
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
        var facet = $lengthFacet.create(0);
        expect(spy).to.be.calledOn(facet).to.be.calledWith(0);
      });

      it("should reject a non-number value", function () {
        expect(bind($lengthFacet, 'create', '123'))
          .to.throw("expecting a non-negative integer less than 2^53");
      });

      it("should reject a non-integer value", function () {
        expect(bind($lengthFacet, 'create', 1.2))
          .to.throw("expecting a non-negative integer less than 2^53");
      });

      it("should reject a value equal to 2^53", function () {
        expect(bind($lengthFacet, 'create', Math.pow(2, 53)))
          .to.throw("expecting a non-negative integer less than 2^53");
      });

      it("should reject a value greater than 2^53", function () {
        expect(bind($lengthFacet, 'create', Math.pow(2, 54)))
          .to.throw("expecting a non-negative integer less than 2^53");
      });

      it("should reject a negative value", function () {
        expect(bind($lengthFacet, 'create', -1))
          .to.throw("expecting a non-negative integer less than 2^53");
      });

    });

    describe('#isRestrictionOf()', function () {

      it("should return true when the type does not define no facet 'length', 'maxLength' or 'minLength'", function () {
        var type = $primitiveType.create({});
        var facet = $lengthFacet.create(0);
        expect(facet.isRestrictionOf(type)).to.be.true;
      });

      context("when the type has effective facet 'length'", function () {

        var type;

        beforeEach(function () {
          var base = $primitiveType.create({
            facets: $facets.create([ $lengthFacet ])
          });
          type = $restrictedType.create(base,
            $facets.create([ $lengthFacet.create(0) ]));
        });

        it("should return true when the value is equal to the type facet's value", function () {
          var facet = $lengthFacet.create(0);
          expect(facet.isRestrictionOf(type)).to.be.true;
        });

        it("should return false when the value is not equal to the type facet's value", function () {
          var facet = $lengthFacet.create(1);
          expect(facet.isRestrictionOf(type)).to.be.false;
        });

      });

      context("when the type has effective facet 'maxLength'", function () {

        var type;

        beforeEach(function () {
          var base = $primitiveType.create({
            facets: $facets.create([ $maxLengthFacet ])
          });
          type = $restrictedType.create(base,
            $facets.create([ $maxLengthFacet.create(1) ]));
        });

        it("should return true when the value is less than the type facet's value", function () {
          var facet = $lengthFacet.create(0);
          expect(facet.isRestrictionOf(type)).to.be.true;
        });

        it("should return true when the value is equal to the type facet's value", function () {
          var facet = $lengthFacet.create(1);
          expect(facet.isRestrictionOf(type)).to.be.true;
        });

        it("should return false when the value is greater than the type facet's value", function () {
          var facet = $lengthFacet.create(2);
          expect(facet.isRestrictionOf(type)).to.be.false;
        });

      });

      context("when the type has effective facet 'minLength'", function () {

        var type;

        beforeEach(function () {
          var base = $primitiveType.create({
            facets: $facets.create([ $minLengthFacet ])
          });
          type = $restrictedType.create(base,
            $facets.create([ $minLengthFacet.create(1) ]));
        });

        it("should return false when the value is less than the type facet's value", function () {
          var facet = $lengthFacet.create(0);
          expect(facet.isRestrictionOf(type)).to.be.false;
        });

        it("should return true when the value is equal to the type facet's value", function () {
          var facet = $lengthFacet.create(1);
          expect(facet.isRestrictionOf(type)).to.be.true;
        });

        it("should return true when the value is greater than the type facet's value", function () {
          var facet = $lengthFacet.create(2);
          expect(facet.isRestrictionOf(type)).to.be.true;
        });

      });

    });

    describe('#validate()', function () {

      var facet;
      var facets;

      beforeEach(function () {
        var dummyFacet = { getQName: returns($qname.create('x', 'urn:y')) };
        facet = $lengthFacet.create(0);
        facets = $facets.create([ dummyFacet ]);
      });

      it("should return true when valid", function () {
        expect(facet.validate(facets)).to.be.true;
      });

      context("with a sulfur/schema/facet/maxLength", function () {

        beforeEach(function () {
          facets = $facets.create([ $maxLengthFacet.create() ]);
        });

        it("should reject", function () {
          expect(facet.validate(facets)).to.be.false;
        });

        it("should add an error message", function () {
          var errors = [];
          facet.validate(facets, errors);
          expect(errors).to.include("cannot be used along with facet 'maxLength'");
        });

      });

      context("with a sulfur/schema/facet/minLength", function () {

        beforeEach(function () {
          facets = $facets.create([ $minLengthFacet.create() ]);
        });

        it("should reject", function () {
          expect(facet.validate(facets)).to.be.false;
        });

        it("should add an error message", function () {
          var errors = [];
          facet.validate(facets, errors);
          expect(errors).to.include("cannot be used along with facet 'minLength'");
        });

      });

    });

    describe('#createValidator()', function () {

      it("should return a validator/property on 'getLength' with a validator/equal", function () {
        var facet = $lengthFacet.create(0);
        var v = facet.createValidator();
        expect(v).to.eql(
          $propertyValidator.create(
            'getLength',
            $equalValidator.create(0)
          )
        );
      });

    });

  });

});
