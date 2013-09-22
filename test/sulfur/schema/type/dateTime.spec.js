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
  'sulfur/schema/facet/maxExclusive',
  'sulfur/schema/facet/maxInclusive',
  'sulfur/schema/facet/minExclusive',
  'sulfur/schema/facet/minInclusive',
  'sulfur/schema/facet/pattern',
  'sulfur/schema/type/_simple',
  'sulfur/schema/type/dateTime',
  'sulfur/schema/value/dateTime'
], function (
    $shared,
    $enumerationFacet,
    $maxExclusiveFacet,
    $maxInclusiveFacet,
    $minExclusiveFacet,
    $minInclusiveFacet,
    $patternFacet,
    $_simpleType,
    $dateTimeType,
    $dateTimeValue
) {

  'use strict';

  var expect = $shared.expect;

  describe('sulfur/schema/type/dateTime', function () {

    it("should be derived from sulfur/schema/type/_simple", function () {
      expect($_simpleType).to.be.prototypeOf($dateTimeType);
    });

    describe('.getLegalFacets()', function () {

      it("should include sulfur/schema/facet/enumeration", function () {
        expect($dateTimeType.getLegalFacets()).to.include($enumerationFacet);
      });

      it("should include sulfur/schema/facet/maxExclusive", function () {
        expect($dateTimeType.getLegalFacets()).to.include($maxExclusiveFacet);
      });

      it("should include sulfur/schema/facet/maxInclusive", function () {
        expect($dateTimeType.getLegalFacets()).to.include($maxInclusiveFacet);
      });

      it("should include sulfur/schema/facet/minExclusive", function () {
        expect($dateTimeType.getLegalFacets()).to.include($minExclusiveFacet);
      });

      it("should include sulfur/schema/facet/minInclusive", function () {
        expect($dateTimeType.getLegalFacets()).to.include($minInclusiveFacet);
      });

      it("should include sulfur/schema/facet/pattern", function () {
        expect($dateTimeType.getLegalFacets()).to.include($patternFacet);
      });

    });

    describe('.getValueType()', function () {

      it("should be sulfur/schema/value/dateTime", function () {
        expect($dateTimeType.getValueType()).to.equal($dateTimeValue);
      });

    });

  });

});
