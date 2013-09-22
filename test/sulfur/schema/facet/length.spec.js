/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/facet/_standard',
  'sulfur/schema/facet/length',
  'sulfur/schema/facet/maxLength',
  'sulfur/schema/facet/minLength',
  'sulfur/schema/type/_faceted',
  'sulfur/schema/validator/equal',
  'sulfur/schema/validator/property'
], function (
    $shared,
    $_standardFacet,
    $lengthFacet,
    $maxLengthFacet,
    $minLengthFacet,
    $_facetedType,
    $equalValidator,
    $propertyValidator
) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;
  var sinon = $shared.sinon;

  describe('sulfur/schema/facet/length', function () {

    it("should be derived from sulfur/schema/facet/_standard", function () {
      expect($_standardFacet).to.be.prototypeOf($lengthFacet);
    });

    describe('.getName()', function () {

      it("should return 'length'", function () {
        expect($lengthFacet.getName()).to.equal('length');
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

      it("should call sulfur/schema/facet/_standard#initialize()", function () {
        var spy = sandbox.spy($_standardFacet.prototype, 'initialize');
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

    describe('#validate()', function () {

      var facet;
      var facets;

      beforeEach(function () {
        facet = $lengthFacet.create(0);
        facets = $_facetedType.create();
      });

      it("should return true when valid", function () {
        expect(facet.validate(facets)).to.be.true;
      });

      context("with a sulfur/schema/facet/maxLength", function () {

        beforeEach(function () {
          facets = $_facetedType.create([ $maxLengthFacet.create() ]);
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
          facets = $_facetedType.create([ $minLengthFacet.create() ]);
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
