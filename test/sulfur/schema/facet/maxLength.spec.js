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
  'sulfur/schema/facet/maxLength',
  'sulfur/schema/facet/minLength',
  'sulfur/schema/type/_faceted',
  'sulfur/schema/validator/maximum',
  'sulfur/schema/validator/property'
], function (
    $shared,
    $_standardFacet,
    $lengthFacet,
    $maxLengthFacet,
    $minLengthFacet,
    $_facetedType,
    $maximumValidator,
    $propertyValidator
) {

  'use strict';

  var expect = $shared.expect;

  describe('sulfur/schema/facet/maxLength', function () {

    it("should be derived from sulfur/schema/facet/_standard", function () {
      expect($_standardFacet).to.be.prototypeOf($maxLengthFacet);
    });

    describe('.getName()', function () {

      it("should return 'maxLength'", function () {
        expect($maxLengthFacet.getName()).to.equal('maxLength');
      });

    });

    describe('#validate()', function () {

      var facet;
      var type;

      beforeEach(function () {
        facet = $maxLengthFacet.create(0);
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

      context("with a value less than sulfur/schema/facet/minLength", function () {

        beforeEach(function () {
          type = $_facetedType.create([ $minLengthFacet.create(1) ]);
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

      it("should return a validator/property with 'getLength' and a validator/maximum", function () {
        var facet = $maxLengthFacet.create(0);
        var v = facet.createValidator();
        expect(v).to.eql(
          $propertyValidator.create(
            'getLength',
            $maximumValidator.create(facet.getValue())
          )
        );
      });

    });

  });

});
