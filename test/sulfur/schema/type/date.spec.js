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
  'sulfur/schema/type/date',
  'sulfur/schema/value/date'
], function (
    $shared,
    $enumerationFacet,
    $maxExclusiveFacet,
    $maxInclusiveFacet,
    $minExclusiveFacet,
    $minInclusiveFacet,
    $patternFacet,
    $_simpleType,
    $dateType,
    $dateValue
) {

  'use strict';

  var expect = $shared.expect;

  describe('sulfur/schema/type/date', function () {

    it("should be derived from sulfur/schema/type/_simple", function () {
      expect($_simpleType).to.be.prototypeOf($dateType);
    });

    describe('.getLegalFacets()', function () {

      it("should include sulfur/schema/facet/enumeration", function () {
        expect($dateType.getLegalFacets()).to.include($enumerationFacet);
      });

      it("should include sulfur/schema/facet/maxExclusive", function () {
        expect($dateType.getLegalFacets()).to.include($maxExclusiveFacet);
      });

      it("should include sulfur/schema/facet/maxInclusive", function () {
        expect($dateType.getLegalFacets()).to.include($maxInclusiveFacet);
      });

      it("should include sulfur/schema/facet/minExclusive", function () {
        expect($dateType.getLegalFacets()).to.include($minExclusiveFacet);
      });

      it("should include sulfur/schema/facet/minInclusive", function () {
        expect($dateType.getLegalFacets()).to.include($minInclusiveFacet);
      });

      it("should include sulfur/schema/facet/pattern", function () {
        expect($dateType.getLegalFacets()).to.include($patternFacet);
      });

    });

    describe('.getValueType()', function () {

      it("should be sulfur/schema/value/date", function () {
        expect($dateType.getValueType()).to.equal($dateValue);
      });

    });

  });

});
