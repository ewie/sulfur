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
  'sulfur/schema/facet/length',
  'sulfur/schema/facet/minLength',
  'sulfur/schema/facet/maxLength',
  'sulfur/schema/facets',
  'sulfur/schema/qname',
  'sulfur/schema/type/simple/primitive',
  'sulfur/schema/type/simple/restricted',
  'sulfur/schema/validator/minimum',
  'sulfur/schema/validator/property'
], function (
    shared,
    Facet,
    LengthFacet,
    MinLengthFacet,
    MaxLengthFacet,
    Facets,
    QName,
    PrimitiveType,
    RestrictedType,
    MinimumValidator,
    PropertyValidator
) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/facet/minLength', function () {

    it("should be derived from sulfur/schema/facet", function () {
      expect(Facet).to.be.prototypeOf(MinLengthFacet);
    });

    describe('.qname', function () {

      it("should return {http://www.w3.org/2001/XMLSchema}minLength", function () {
        expect(MinLengthFacet.qname)
          .to.eql(QName.create('minLength', 'http://www.w3.org/2001/XMLSchema'));
      });

    });

    describe('.isShadowingLowerRestrictions()', function () {

      it("should return false", function () {
        expect(MinLengthFacet.isShadowingLowerRestrictions()).to.be.true;
      });

    });

    describe('.mutualExclusiveFacets', function () {

      it("should return sulfur/schema/facet/length", function () {
        expect(MinLengthFacet.mutualExclusiveFacets)
          .to.eql([ LengthFacet ]);
      });

    });

    describe('#isRestrictionOf()', function () {

      it("should return true when the type does not define no facet 'length', 'maxLength' or 'minLength'", function () {
        var type = PrimitiveType.create({});
        var facet = MinLengthFacet.create(0);
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

        it("should return false", function () {
          var facet = MinLengthFacet.create(0);
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
          var facet = MinLengthFacet.create(0);
          expect(facet.isRestrictionOf(type)).to.be.true;
        });

        it("should return true when the value is equal to the type facet's value", function () {
          var facet = MinLengthFacet.create(1);
          expect(facet.isRestrictionOf(type)).to.be.true;
        });

        it("should return false when the value is greater than the type facet's value", function () {
          var facet = MinLengthFacet.create(2);
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
          var facet = MinLengthFacet.create(0);
          expect(facet.isRestrictionOf(type)).to.be.false;
        });

        it("should return true when the value is equal to the type facet's value", function () {
          var facet = MinLengthFacet.create(1);
          expect(facet.isRestrictionOf(type)).to.be.true;
        });

        it("should return true when the value is greater than the type facet's value", function () {
          var facet = MinLengthFacet.create(2);
          expect(facet.isRestrictionOf(type)).to.be.true;
        });

      });

    });

    describe('#validate()', function () {

      var facet;
      var type;

      beforeEach(function () {
        var dummyFacet = { qname: QName.create('x', 'urn:y') };
        facet = MinLengthFacet.create(1);
        type = Facets.create([ dummyFacet ]);
      });

      it("should return true when valid", function () {
        expect(facet.validate(type)).to.be.true;
      });

      context("with a value greater than sulfur/schema/facet/maxLength", function () {

        beforeEach(function () {
          type = Facets.create([ MaxLengthFacet.create(0) ]);
        });

        it("should reject", function () {
          expect(facet.validate(type)).to.be.false;
        });

        it("should add an error message", function () {
          var errors = [];
          facet.validate(type, errors);
          expect(errors).to.include("must not be greater than facet 'maxLength'");
        });

      });

    });

    describe('#createValidator()', function () {

      it("should return a validator/property with 'length' and a validator/minimum", function () {
        var facet = MinLengthFacet.create(0);
        var v = facet.createValidator();
        expect(v).to.eql(
          PropertyValidator.create(
            'length',
            MinimumValidator.create(facet.value)
          )
        );
      });

    });

  });

});
