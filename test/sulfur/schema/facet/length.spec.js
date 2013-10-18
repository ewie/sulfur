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
    shared,
    Facet,
    LengthFacet,
    MaxLengthFacet,
    MinLengthFacet,
    Facets,
    QName,
    PrimitiveType,
    RestrictedType,
    EqualValidator,
    PropertyValidator
) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var bind = shared.bind;
  var returns = shared.returns;

  describe('sulfur/schema/facet/length', function () {

    it("should be derived from sulfur/schema/facet", function () {
      expect(Facet).to.be.prototypeOf(LengthFacet);
    });

    describe('.getQName()', function () {

      it("should return {http://www.w3.org/2001/XMLSchema}length", function () {
        expect(LengthFacet.getQName())
          .to.eql(QName.create('length', 'http://www.w3.org/2001/XMLSchema'));
      });

    });

    describe('.isShadowingLowerRestrictions()', function () {

      it("should return true", function () {
        expect(LengthFacet.isShadowingLowerRestrictions()).to.be.true;
      });

    });

    describe('.getMutualExclusiveFacets()', function () {

      it("should return sulfur/schema/facet/maxLength and sulfur/schema/facet/minLength", function () {
        expect(LengthFacet.getMutualExclusiveFacets())
          .to.eql([ MaxLengthFacet, MinLengthFacet ]);
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
        var facet = LengthFacet.create(0);
        expect(spy).to.be.calledOn(facet).to.be.calledWith(0);
      });

      it("should reject a non-number value", function () {
        expect(bind(LengthFacet, 'create', '123'))
          .to.throw("expecting a non-negative integer less than 2^53");
      });

      it("should reject a non-integer value", function () {
        expect(bind(LengthFacet, 'create', 1.2))
          .to.throw("expecting a non-negative integer less than 2^53");
      });

      it("should reject a value equal to 2^53", function () {
        expect(bind(LengthFacet, 'create', Math.pow(2, 53)))
          .to.throw("expecting a non-negative integer less than 2^53");
      });

      it("should reject a value greater than 2^53", function () {
        expect(bind(LengthFacet, 'create', Math.pow(2, 54)))
          .to.throw("expecting a non-negative integer less than 2^53");
      });

      it("should reject a negative value", function () {
        expect(bind(LengthFacet, 'create', -1))
          .to.throw("expecting a non-negative integer less than 2^53");
      });

    });

    describe('#isRestrictionOf()', function () {

      it("should return true when the type does not define no facet 'length', 'maxLength' or 'minLength'", function () {
        var type = PrimitiveType.create({});
        var facet = LengthFacet.create(0);
        expect(facet.isRestrictionOf(type)).to.be.true;
      });

      context("when the type has effective facet 'length'", function () {

        var type;

        beforeEach(function () {
          var base = PrimitiveType.create({
            facets: Facets.create([ LengthFacet ])
          });
          type = RestrictedType.create(base,
            Facets.create([ LengthFacet.create(0) ]));
        });

        it("should return true when the value is equal to the type facet's value", function () {
          var facet = LengthFacet.create(0);
          expect(facet.isRestrictionOf(type)).to.be.true;
        });

        it("should return false when the value is not equal to the type facet's value", function () {
          var facet = LengthFacet.create(1);
          expect(facet.isRestrictionOf(type)).to.be.false;
        });

      });

      context("when the type has effective facet 'maxLength'", function () {

        var type;

        beforeEach(function () {
          var base = PrimitiveType.create({
            facets: Facets.create([ MaxLengthFacet ])
          });
          type = RestrictedType.create(base,
            Facets.create([ MaxLengthFacet.create(1) ]));
        });

        it("should return true when the value is less than the type facet's value", function () {
          var facet = LengthFacet.create(0);
          expect(facet.isRestrictionOf(type)).to.be.true;
        });

        it("should return true when the value is equal to the type facet's value", function () {
          var facet = LengthFacet.create(1);
          expect(facet.isRestrictionOf(type)).to.be.true;
        });

        it("should return false when the value is greater than the type facet's value", function () {
          var facet = LengthFacet.create(2);
          expect(facet.isRestrictionOf(type)).to.be.false;
        });

      });

      context("when the type has effective facet 'minLength'", function () {

        var type;

        beforeEach(function () {
          var base = PrimitiveType.create({
            facets: Facets.create([ MinLengthFacet ])
          });
          type = RestrictedType.create(base,
            Facets.create([ MinLengthFacet.create(1) ]));
        });

        it("should return false when the value is less than the type facet's value", function () {
          var facet = LengthFacet.create(0);
          expect(facet.isRestrictionOf(type)).to.be.false;
        });

        it("should return true when the value is equal to the type facet's value", function () {
          var facet = LengthFacet.create(1);
          expect(facet.isRestrictionOf(type)).to.be.true;
        });

        it("should return true when the value is greater than the type facet's value", function () {
          var facet = LengthFacet.create(2);
          expect(facet.isRestrictionOf(type)).to.be.true;
        });

      });

    });

    describe('#validate()', function () {

      var facet;
      var facets;

      beforeEach(function () {
        var dummyFacet = { getQName: returns(QName.create('x', 'urn:y')) };
        facet = LengthFacet.create(0);
        facets = Facets.create([ dummyFacet ]);
      });

      it("should return true when valid", function () {
        expect(facet.validate(facets)).to.be.true;
      });

      context("with a sulfur/schema/facet/maxLength", function () {

        beforeEach(function () {
          facets = Facets.create([ MaxLengthFacet.create() ]);
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
          facets = Facets.create([ MinLengthFacet.create() ]);
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
        var facet = LengthFacet.create(0);
        var v = facet.createValidator();
        expect(v).to.eql(
          PropertyValidator.create(
            'getLength',
            EqualValidator.create(0)
          )
        );
      });

    });

  });

});
