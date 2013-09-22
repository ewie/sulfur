/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/facet/fractionDigits',
  'sulfur/schema/pattern',
  'sulfur/schema/type/decimal',
  'sulfur/schema/type/integer',
  'sulfur/schema/value/integer'
], function (
    $shared,
    $fractionDigitsFacet,
    $pattern,
    $decimalType,
    $integerType,
    $integerValue
) {

  'use strict';

  var expect = $shared.expect;
  var sinon = $shared.sinon;

  describe('sulfur/schema/type/integer', function () {

    it("should be derived from sulfur/schema/type/decimal", function () {
      expect($decimalType).to.be.prototypeOf($integerType);
    });

    describe('.getValueType()', function () {

      it("should be sulfur/schema/value/integer", function () {
        expect($integerType.getValueType()).to.equal($integerValue);
      });

    });

    describe('#validateFacets()', function () {

      var sandbox;

      beforeEach(function () {
        sandbox = sinon.sandbox.create();
      });

      afterEach(function () {
        sandbox.restore();
      });

      it("should return false when sulfur/schema/type/decimal#validateFacets() returns false", function () {
        var spy = sandbox.stub($decimalType.prototype, 'validateFacets').returns(false);
        var type = $integerType.create();
        expect(type.validateFacets()).to.be.false;
        expect(spy).to.be.calledOn(type);
      });

      it("should return true when no facets are defined", function () {
        var type = $integerType.create();
        expect(type.validateFacets()).to.be.true;
      });

      context("with facets", function () {

        it("should return true when all facets are valid", function () {
          var type = $integerType.create([]);
          expect(type.validateFacets()).to.be.true;
        });

        it("should reject facet 'fractionDigits' with non-zero value", function () {
          var facets = [ $fractionDigitsFacet.create(1) ];
          var type = $integerType.create(facets);
          expect(type.validateFacets()).to.be.false;
        });

      });

    });

  });

});
