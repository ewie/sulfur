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
  'sulfur/schema/facet/length',
  'sulfur/schema/facet/maxLength',
  'sulfur/schema/facet/minLength',
  'sulfur/schema/facet/pattern',
  'sulfur/schema/type/_simple',
  'sulfur/schema/type/string',
  'sulfur/schema/value/string'
], function (
    $shared,
    $enumerationFacet,
    $lengthFacet,
    $maxLengthFacet,
    $minLengthFacet,
    $patternFacet,
    $_simpleType,
    $stringType,
    $stringValue
) {

  'use strict';

  var expect = $shared.expect;

  describe('sulfur/schema/type/string', function () {

    it("should be derived from sulfur/schema/type/_simple", function () {
      expect($_simpleType).to.be.prototypeOf($stringType);
    });

    describe('.getLegalFacets()', function () {

      it("should include sulfur/schema/facet/enumeration", function () {
        expect($stringType.getLegalFacets()).to.include($enumerationFacet);
      });

      it("should include sulfur/schema/facet/length", function () {
        expect($stringType.getLegalFacets()).to.include($lengthFacet);
      });

      it("should include sulfur/schema/facet/maxLength", function () {
        expect($stringType.getLegalFacets()).to.include($maxLengthFacet);
      });

      it("should include sulfur/schema/facet/minLength", function () {
        expect($stringType.getLegalFacets()).to.include($minLengthFacet);
      });

      it("should include sulfur/schema/facet/pattern", function () {
        expect($stringType.getLegalFacets()).to.include($patternFacet);
      });

    });

    describe('.getValueType()', function () {

      it("should be sulfur/schema/value/string", function () {
        expect($stringType.getValueType()).to.equal($stringValue);
      });

    });

  });

});
