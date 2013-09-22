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
  'sulfur/schema/facet/length',
  'sulfur/schema/facet/minLength',
  'sulfur/schema/facet/maxLength',
  'sulfur/schema/type/_faceted',
  'sulfur/schema/validator/minimum',
  'sulfur/schema/validator/property'
], function (
    $shared,
    $_standardFacet,
    $lengthFacet,
    $minLengthFacet,
    $maxLengthFacet,
    $_facetedType,
    $minimumValidator,
    $propertyValidator
) {

  'use strict';

  var expect = $shared.expect;

  describe('sulfur/schema/facet/minLength', function () {

    it("should be derived from sulfur/schema/facet/_standard", function () {
      expect($_standardFacet).to.be.prototypeOf($minLengthFacet);
    });

    describe('.getName()', function () {

      it("should return 'minLength'", function () {
        expect($minLengthFacet.getName()).to.equal('minLength');
      });

    });

    describe('#validate()', function () {

      var facet;
      var type;

      beforeEach(function () {
        facet = $minLengthFacet.create(1);
        type = $_facetedType.create();
      });

      it("should return true when valid", function () {
        expect(facet.validate(type)).to.be.true;
      });

      context("with a sulfur/schema/facet/length", function () {

        beforeEach(function () {
          type = $_facetedType.create([ $lengthFacet.create(0) ]);
        });

        it("should reject", function () {
          expect(facet.validate(type)).to.be.false;
        });

        it("should add an error message", function () {
          var errors = [];
          facet.validate(type, errors);
          expect(errors).to.include("cannot be used along with facet 'length'");
        });

      });

      context("with a value greater than sulfur/schema/facet/maxLength", function () {

        beforeEach(function () {
          type = $_facetedType.create([ $maxLengthFacet.create(0) ]);
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

      it("should return a validator/property with 'getLength' and a validator/minimum", function () {
        var facet = $minLengthFacet.create(0);
        var v = facet.createValidator();
        expect(v).to.eql(
          $propertyValidator.create(
            'getLength',
            $minimumValidator.create(facet.getValue())
          )
        );
      });

    });

  });

});
