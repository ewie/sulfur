/*
 * Copyright (c) 2013, 2014, Erik Wienhold
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
  'sulfur/schema/validator/property',
  'sulfur/schema/value/simple/integer'
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
    PropertyValidator,
    IntegerValue
) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var bind = shared.bind;

  describe('sulfur/schema/facet/length', function () {

    it("should be derived from sulfur/schema/facet", function () {
      expect(Facet).to.be.prototypeOf(LengthFacet);
    });

    describe('.qname', function () {

      it("should return {http://www.w3.org/2001/XMLSchema}length", function () {
        expect(LengthFacet.qname)
          .to.eql(QName.create('length', 'http://www.w3.org/2001/XMLSchema'));
      });

    });

    describe('.isShadowingLowerRestrictions', function () {

      it("should return true", function () {
        expect(LengthFacet.isShadowingLowerRestrictions).to.be.true;
      });

    });

    describe('.mutexFacets', function () {

      it("should return sulfur/schema/facet/maxLength and sulfur/schema/facet/minLength", function () {
        expect(LengthFacet.mutexFacets)
          .to.eql([ MaxLengthFacet, MinLengthFacet ]);
      });

    });

    describe('.getValueType()', function () {

      it("should return sulfur/schema/value/simple/integer", function () {
        expect(LengthFacet.getValueType()).to.equal(IntegerValue);
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
        var value = IntegerValue.create();
        var facet = LengthFacet.create(value);
        expect(spy)
          .to.be.calledOn(facet)
          .to.be.calledWith(sinon.match.same(value));
      });

      it("should reject a non-integer value", function () {
        expect(bind(LengthFacet, 'create', {}))
          .to.throw("expecting a non-negative sulfur/schema/value/simple/integer");
      });

      it("should reject a negative value", function () {
        expect(bind(LengthFacet, 'create', IntegerValue.parse('-1')))
          .to.throw("expecting a non-negative sulfur/schema/value/simple/integer");
      });

    });

    describe('#isRestrictionOf()', function () {

      it("should return true when the type does not define no facet 'length', 'maxLength' or 'minLength'", function () {
        var type = PrimitiveType.create({});
        var facet = LengthFacet.create(IntegerValue.create());
        expect(facet.isRestrictionOf(type)).to.be.true;
      });

      context("when the type has effective facet 'length'", function () {

        var type;

        beforeEach(function () {
          var base = PrimitiveType.create({
            facets: Facets.create([ LengthFacet ])
          });
          type = RestrictedType.create(base,
            Facets.create([ LengthFacet.create(IntegerValue.create()) ]));
        });

        it("should return true when the value is equal to the type facet's value", function () {
          var facet = LengthFacet.create(IntegerValue.create());
          expect(facet.isRestrictionOf(type)).to.be.true;
        });

        it("should return false when the value is not equal to the type facet's value", function () {
          var facet = LengthFacet.create(IntegerValue.parse('1'));
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
            Facets.create([ MaxLengthFacet.create(IntegerValue.parse('1')) ]));
        });

        it("should return true when the value is less than the type facet's value", function () {
          var facet = LengthFacet.create(IntegerValue.create());
          expect(facet.isRestrictionOf(type)).to.be.true;
        });

        it("should return true when the value is equal to the type facet's value", function () {
          var facet = LengthFacet.create(IntegerValue.parse('1'));
          expect(facet.isRestrictionOf(type)).to.be.true;
        });

        it("should return false when the value is greater than the type facet's value", function () {
          var facet = LengthFacet.create(IntegerValue.parse('2'));
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
            Facets.create([ MinLengthFacet.create(IntegerValue.parse('1')) ]));
        });

        it("should return false when the value is less than the type facet's value", function () {
          var facet = LengthFacet.create(IntegerValue.create());
          expect(facet.isRestrictionOf(type)).to.be.false;
        });

        it("should return true when the value is equal to the type facet's value", function () {
          var facet = LengthFacet.create(IntegerValue.parse('1'));
          expect(facet.isRestrictionOf(type)).to.be.true;
        });

        it("should return true when the value is greater than the type facet's value", function () {
          var facet = LengthFacet.create(IntegerValue.parse('2'));
          expect(facet.isRestrictionOf(type)).to.be.true;
        });

      });

    });

    describe('#validateAmongFacets()', function () {

      var facet;
      var facets;

      beforeEach(function () {
        var dummyFacet = { qname: QName.create('x', 'urn:example:y') };
        facet = LengthFacet.create(IntegerValue.create());
        facets = Facets.create([ dummyFacet ]);
      });

      it("should return true when valid", function () {
        expect(facet.validateAmongFacets(facets)).to.be.true;
      });

      context("with a sulfur/schema/facet/maxLength", function () {

        beforeEach(function () {
          facets = Facets.create([ MaxLengthFacet.create(IntegerValue.create()) ]);
        });

        it("should reject", function () {
          expect(facet.validateAmongFacets(facets)).to.be.false;
        });

        it("should add an error message", function () {
          var errors = [];
          facet.validateAmongFacets(facets, errors);
          expect(errors).to.include("cannot be used along with facet 'maxLength'");
        });

      });

      context("with a sulfur/schema/facet/minLength", function () {

        beforeEach(function () {
          facets = Facets.create([ MinLengthFacet.create(IntegerValue.create()) ]);
        });

        it("should reject", function () {
          expect(facet.validateAmongFacets(facets)).to.be.false;
        });

        it("should add an error message", function () {
          var errors = [];
          facet.validateAmongFacets(facets, errors);
          expect(errors).to.include("cannot be used along with facet 'minLength'");
        });

      });

    });

    describe('#createValidator()', function () {

      it("should return a validator/property on 'length' with a validator/equal", function () {
        var facet = LengthFacet.create(IntegerValue.create());
        var v = facet.createValidator();
        expect(v).to.eql(
          PropertyValidator.create(
            'length',
            EqualValidator.create(facet.value)
          )
        );
      });

    });

  });

});
