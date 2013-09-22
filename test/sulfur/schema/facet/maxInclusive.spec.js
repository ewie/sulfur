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
  'sulfur/schema/validator/maximum',
  'sulfur/schema/value/integer'
], function (
    $shared,
    $_standardFacet,
    $maxExclusiveFacet,
    $maxInclusiveFacet,
    $minExclusiveFacet,
    $minInclusiveFacet,
    $_facetedType,
    $maximumValidator,
    $integerValue
) {

  'use strict';

  var expect = $shared.expect;

  describe('sulfur/schema/facet/maxInclusive', function () {

    it("should be derived from sulfur/schema/facet/_standard", function () {
      expect($_standardFacet).to.be.prototypeOf($maxInclusiveFacet);
    });

    describe('#getName()', function () {

      it("should return 'maxInclusive'", function () {
        expect($maxInclusiveFacet.getName()).to.equal('maxInclusive');
      });

    });

    describe('.getEffectiveValue()', function () {

      it("should return the smallest value", function () {
        var values = [
          $integerValue.parse('2'),
          $integerValue.parse('1')
        ];
        expect($maxInclusiveFacet.getEffectiveValue(values)).to.eql(
          $integerValue.parse('1'));
      });

    });

    describe('#validate()', function () {

      var facet;
      var type;

      beforeEach(function () {
        facet = $maxInclusiveFacet.create($integerValue.create());
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

      context("with a sulfur/schema/facet/maxExclusive", function () {

        beforeEach(function () {
          type = $_facetedType.create([ $maxExclusiveFacet.create() ]);
          type.getValueType = function () { return $integerValue; };
        });

        it("should reject", function () {
          expect(facet.validate(type)).to.be.false;
        });

        it("should add an error message", function () {
          var errors = [];
          facet.validate(type, errors);
          expect(errors).to.include("cannot be used along with facet 'maxExclusive'");
        });

      });

      context("with a value less than sulfur/schema/facet/minExclusive when given", function () {

        beforeEach(function () {
          type = $_facetedType.create([
            $minExclusiveFacet.create($integerValue.parse('2'))
          ]);
          type.getValueType = function () { return $integerValue; };
        });

        it("should reject", function () {
          expect(facet.validate(type)).to.be.false;
        });

        it("should add an error message", function () {
          var errors = [];
          facet.validate(type, errors);
          expect(errors).to.include("must be greater than facet 'minExclusive'");
        });

      });

      context("with a value equal to sulfur/schema/facet/minExclusive when given", function () {

        beforeEach(function () {
          type = $_facetedType.create([
            $minExclusiveFacet.create($integerValue.create())
          ]);
          type.getValueType = function () { return $integerValue; };
        });

        it("should reject", function () {
          expect(facet.validate(type)).to.be.false;
        });

        it("should add an error message", function () {
          var errors = [];
          facet.validate(type, errors);
          expect(errors).to.include("must be greater than facet 'minExclusive'");
        });

      });

      context("with a value less than sulfur/schema/facet/minInclusive when given", function () {

        beforeEach(function () {
          type = $_facetedType.create([
            $minInclusiveFacet.create($integerValue.parse('2'))
          ]);
          type.getValueType = function () { return $integerValue; };
        });

        it("should reject", function () {
          expect(facet.validate(type)).to.be.false;
        });

        it("should add an error message", function () {
          var errors = [];
          facet.validate(type, errors);
          expect(errors).to.include("must be greater than or equal to facet 'minInclusive'");
        });

      });

    });

    describe('#createValidator()', function () {

      it("should return a validator/maximum matching inclusively", function () {
        var facet = $maxInclusiveFacet.create(0);
        var v = facet.createValidator();
        expect(v).to.eql(
          $maximumValidator.create(facet.getValue())
        );
      });

    });

  });

});
