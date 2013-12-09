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
  'sulfur/schema/validator/maximum',
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
    MaximumValidator,
    PropertyValidator,
    IntegerValue
) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var bind = shared.bind;

  describe('sulfur/schema/facet/maxLength', function () {

    it("should be derived from sulfur/schema/facet", function () {
      expect(Facet).to.be.prototypeOf(MaxLengthFacet);
    });

    describe('.qname', function () {

      it("should return {http://www.w3.org/2001/XMLSchema}maxLength", function () {
        expect(MaxLengthFacet.qname)
          .to.eql(QName.create('maxLength', 'http://www.w3.org/2001/XMLSchema'));
      });

    });

    describe('.isShadowingLowerRestrictions', function () {

      it("should return true", function () {
        expect(MaxLengthFacet.isShadowingLowerRestrictions).to.be.true;
      });

    });

    describe('.mutualExclusiveFacets', function () {

      it("should return sulfur/schema/facet/length", function () {
        expect(MaxLengthFacet.mutualExclusiveFacets)
          .to.eql([ LengthFacet ]);
      });

    });

    describe('.getValueType()', function () {

      it("should return sulfur/schema/value/simple/integer", function () {
        expect(MaxLengthFacet.getValueType()).to.equal(IntegerValue);
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
        var facet = MaxLengthFacet.create(value);
        expect(spy)
          .to.be.calledOn(facet)
          .to.be.calledWith(sinon.match.same(value));
      });

      it("should reject a non-integer value", function () {
        expect(bind(MaxLengthFacet, 'create', {}))
          .to.throw("expecting a non-negative sulfur/schema/value/simple/integer");
      });

      it("should reject a negative value", function () {
        expect(bind(MaxLengthFacet, 'create', IntegerValue.parse('-1')))
          .to.throw("expecting a non-negative sulfur/schema/value/simple/integer");
      });

    });

    describe('#isRestrictionOf()', function () {

      it("should return true when the type does not define no facet 'length', 'maxLength' or 'minLength'", function () {
        var type = PrimitiveType.create({});
        var facet = MaxLengthFacet.create(IntegerValue.create());
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

        it("should return false", function () {
          var facet = MaxLengthFacet.create(IntegerValue.create());
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
          var facet = MaxLengthFacet.create(IntegerValue.create());
          expect(facet.isRestrictionOf(type)).to.be.true;
        });

        it("should return true when the value is equal to the type facet's value", function () {
          var facet = MaxLengthFacet.create(IntegerValue.parse('1'));
          expect(facet.isRestrictionOf(type)).to.be.true;
        });

        it("should return false when the value is greater than the type facet's value", function () {
          var facet = MaxLengthFacet.create(IntegerValue.parse('2'));
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
          var facet = MaxLengthFacet.create(IntegerValue.create());
          expect(facet.isRestrictionOf(type)).to.be.false;
        });

        it("should return true when the value is equal to the type facet's value", function () {
          var facet = MaxLengthFacet.create(IntegerValue.parse('1'));
          expect(facet.isRestrictionOf(type)).to.be.true;
        });

        it("should return true when the value is greater than the type facet's value", function () {
          var facet = MaxLengthFacet.create(IntegerValue.parse('2'));
          expect(facet.isRestrictionOf(type)).to.be.true;
        });

      });

    });

    describe('#validate()', function () {

      var facet;
      var type;

      beforeEach(function () {
        var dummyFacet = { qname: QName.create('x', 'urn:example:y') };
        facet = MaxLengthFacet.create(IntegerValue.create());
        type = Facets.create([ dummyFacet ]);
      });

      it("should return true when valid", function () {
        expect(facet.validate(type)).to.be.true;
      });

      context("with a value less than sulfur/schema/facet/minLength", function () {

        beforeEach(function () {
          type = Facets.create([ MinLengthFacet.create(IntegerValue.parse('1')) ]);
        });

        it("should reject", function () {
          expect(facet.validate(type)).to.be.false;
        });

        it("should add an error message", function () {
          var errors = [];
          facet.validate(type, errors);
          expect(errors).to.include("must not be less than facet 'minLength'");
        });

      });

    });

    describe('#createValidator()', function () {

      it("should return a validator/property with 'length' and a validator/maximum", function () {
        var facet = MaxLengthFacet.create(IntegerValue.create());
        var v = facet.createValidator();
        expect(v).to.eql(
          PropertyValidator.create(
            'length',
            MaximumValidator.create(facet.value)
          )
        );
      });

    });

  });

});
