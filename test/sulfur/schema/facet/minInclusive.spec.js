/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/facet/_standard',
  'sulfur/schema/facet/maxExclusive',
  'sulfur/schema/facet/maxInclusive',
  'sulfur/schema/facet/minExclusive',
  'sulfur/schema/facet/minInclusive',
  'sulfur/schema/type/_faceted',
  'sulfur/schema/validator/minimum',
  'sulfur/schema/value/integer'
], function (
    $shared,
    $_standardFacet,
    $maxExclusiveFacet,
    $maxInclusiveFacet,
    $minExclusiveFacet,
    $minInclusiveFacet,
    $_facetedType,
    $minimumValidator,
    $integerValue
) {

  'use strict';

  var expect = $shared.expect;

  describe('sulfur/schema/facet/minInclusive', function () {

    it("should be derived from sulfur/schema/facet/_standard", function () {
      expect($_standardFacet).to.be.prototypeOf($minInclusiveFacet);
    });

    describe('.getName()', function () {

      it("should return 'minInclusive'", function () {
        expect($minInclusiveFacet.getName()).to.equal('minInclusive');
      });

    });

    describe('.getEffectiveValue()', function () {

      it("should return the largest value", function () {
        var values = [
          $integerValue.parse('2'),
          $integerValue.parse('1')
        ];
        expect($minInclusiveFacet.getEffectiveValue(values)).to.eql(
          $integerValue.parse('2'));
      });

    });

    describe('#validate()', function () {

      var facet;
      var type;

      beforeEach(function () {
        facet = $minInclusiveFacet.create($integerValue.create());
      });

      it("should return true when valid", function () {
        type = $_facetedType.create();
        type.getValueType = function () { return $integerValue; };
        expect(facet.validate(type)).to.be.true;
      });

      it("should return false when the value is not of the given type", function () {
        type.getValueType = function () { return { prototype: {} }; };
        expect(facet.validate(type)).to.be.false;
      });

      context("with a sulfur/schema/facet/minExclusive", function () {

        beforeEach(function () {
          type = $_facetedType.create([ $minExclusiveFacet.create() ]);
          type.getValueType = function () { return $integerValue; };
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
          type = $_facetedType.create([
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
          expect(errors).to.include("must be less than facet 'maxExclusive'");
        });

      });

      context("with a value equal to sulfur/schema/facet/maxExclusive when given", function () {

        beforeEach(function () {
          type = $_facetedType.create([
            $maxExclusiveFacet.create($integerValue.create())
          ]);
          type.getValueType = function () { return $integerValue; };
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
          type = $_facetedType.create([
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
          expect(errors).to.include("must be less than or equal to facet 'maxInclusive'");
        });

      });

    });

    describe('#createValidator()', function () {

      it("should return a validator/minimum matching inclusively", function () {
        var facet = $minInclusiveFacet.create(0);
        var v = facet.createValidator();
        expect(v).to.eql($minimumValidator.create(facet.getValue()));
      });

    });

  });

});
