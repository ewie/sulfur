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

  describe('sulfur/schema/facet/minExclusive', function () {

    it("should be derived from sulfur/schema/facet/_standard", function () {
      expect($_standardFacet).to.be.prototypeOf($minExclusiveFacet);
    });

    describe('.getName()', function () {

      it("should return 'minExclusive'", function () {
        expect($minExclusiveFacet.getName()).to.equal('minExclusive');
      });

    });

    describe('.getEffectiveValue()', function () {

      it("should return the largest value", function () {
        var values = [
          $integerValue.parse('2'),
          $integerValue.parse('1')
        ];
        expect($minExclusiveFacet.getEffectiveValue(values)).to.eql(
          $integerValue.parse('2'));
      });

    });

    describe('#validate()', function () {

      var facet;
      var type;

      beforeEach(function () {
        facet = $minExclusiveFacet.create($integerValue.create());
      });

      it("should return true when valid", function () {
        type = $_facetedType.create();
        type.getValueType = function () { return $integerValue; };
        expect(facet.validate(type)).to.be.true;
      });

      it("should return false when the value is not of the given type", function () {
        type = $_facetedType.create();
        type.getValueType = function () { return { prototype: {} }; };
        expect(facet.validate(type)).to.be.false;
      });

      context("with a sulfur/schema/facet/minInclusive", function () {

        beforeEach(function () {
          type = $_facetedType.create([ $minInclusiveFacet.create() ]);
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
          expect(errors).to.include("must be less than or equal to facet 'maxExclusive'");
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
          expect(errors).to.include("must be less than facet 'maxInclusive'");
        });

      });

      context("with a value equal to sulfur/schema/facet/maxInclusive when given", function () {

        beforeEach(function () {
          type = $_facetedType.create([
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
