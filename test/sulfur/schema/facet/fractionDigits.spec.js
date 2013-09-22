/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, describe, it */

define([
  'shared',
  'sulfur/schema/facet/_standard',
  'sulfur/schema/facet/fractionDigits',
  'sulfur/schema/validator/maximum',
  'sulfur/schema/validator/property'
], function (
    $shared,
    $_standardFacet,
    $fractionDigitsFacet,
    $maximumValidator,
    $propertyValidator
) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;
  var sinon = $shared.sinon;

  describe('sulfur/schema/facet/fractionDigits', function () {

    it("should be derived from sulfur/schema/facet/_standard", function () {
      expect($_standardFacet).to.be.prototypeOf($fractionDigitsFacet);
    });

    describe('.getName()', function () {

      it("should return 'fractionDigits'", function () {
        expect($fractionDigitsFacet.getName()).to.equal('fractionDigits');
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
        var facet = $fractionDigitsFacet.create(0);
        expect(spy).to.be.calledOn(facet).to.be.calledWith(0);
      });

      it("should reject a non-number value", function () {
        expect(bind($fractionDigitsFacet, 'create', '123'))
          .to.throw("expecting a non-negative integer less than 2^53");
      });

      it("should reject a non-integer value", function () {
        expect(bind($fractionDigitsFacet, 'create', 1.2))
          .to.throw("expecting a non-negative integer less than 2^53");
      });

      it("should reject a value equal to 2^53", function () {
        expect(bind($fractionDigitsFacet, 'create', Math.pow(2, 53)))
          .to.throw("expecting a non-negative integer less than 2^53");
      });

      it("should reject a value greater than 2^53", function () {
        expect(bind($fractionDigitsFacet, 'create', Math.pow(2, 54)))
          .to.throw("expecting a non-negative integer less than 2^53");
      });

      it("should reject a negative value", function () {
        expect(bind($fractionDigitsFacet, 'create', -1))
          .to.throw("expecting a non-negative integer less than 2^53");
      });

    });

    describe('#validate()', function () {

      it("should return true", function () {
        var facet = $fractionDigitsFacet.create(0);
        expect(facet.validate()).to.be.true;
      });

    });

    describe('#createValidator()', function () {

      it("should return a validator/property with 'countFractionDigits' and a validator/maximum", function () {
        var facet = $fractionDigitsFacet.create(0);
        var v = facet.createValidator();
        expect(v).to.eql(
          $propertyValidator.create(
            'countFractionDigits',
            $maximumValidator.create(0)
          )
        );
      });

    });

  });

});
