/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/facet/enumeration',
  'sulfur/schema/facet/fractionDigits',
  'sulfur/schema/facet/maxExclusive',
  'sulfur/schema/facet/maxInclusive',
  'sulfur/schema/facet/minExclusive',
  'sulfur/schema/facet/minInclusive',
  'sulfur/schema/facet/pattern',
  'sulfur/schema/facet/totalDigits',
  'sulfur/schema/type/_simple',
  'sulfur/schema/type/decimal',
  'sulfur/schema/value/decimal'
], function (
    $shared,
    $enumerationFacet,
    $fractionDigitsFacet,
    $maxExclusiveFacet,
    $maxInclusiveFacet,
    $minExclusiveFacet,
    $minInclusiveFacet,
    $patternFacet,
    $totalDigitsFacet,
    $_simpleType,
    $decimalType,
    $decimalValue
) {

  'use strict';

  var expect = $shared.expect;

  describe('sulfur/schema/type/decimal', function () {

    it("should be derived from sulfur/schema/type/_simple", function () {
      expect($_simpleType).to.be.prototypeOf($decimalType);
    });

    describe('.getLegalFacets()', function () {

      it("should include sulfur/schema/facet/enumeration", function () {
        expect($decimalType.getLegalFacets()).to.include($enumerationFacet);
      });

      it("should include sulfur/schema/facet/fractionDigits", function () {
        expect($decimalType.getLegalFacets()).to.include($fractionDigitsFacet);
      });

      it("should include sulfur/schema/facet/maxExclusive", function () {
        expect($decimalType.getLegalFacets()).to.include($maxExclusiveFacet);
      });

      it("should include sulfur/schema/facet/maxInclusive", function () {
        expect($decimalType.getLegalFacets()).to.include($maxInclusiveFacet);
      });

      it("should include sulfur/schema/facet/minExclusive", function () {
        expect($decimalType.getLegalFacets()).to.include($minExclusiveFacet);
      });

      it("should include sulfur/schema/facet/minInclusive", function () {
        expect($decimalType.getLegalFacets()).to.include($minInclusiveFacet);
      });

      it("should include sulfur/schema/facet/pattern", function () {
        expect($decimalType.getLegalFacets()).to.include($patternFacet);
      });

      it("should include sulfur/schema/facet/totalDigits", function () {
        expect($decimalType.getLegalFacets()).to.include($totalDigitsFacet);
      });

    });

    describe('.getValueType()', function () {

      it("should be sulfur/schema/value/decimal", function () {
        expect($decimalType.getValueType()).to.equal($decimalValue);
      });

    });

  });

});
