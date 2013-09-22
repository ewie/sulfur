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
  'sulfur/schema/facet/pattern',
  'sulfur/schema/type/_simple',
  'sulfur/schema/type/boolean',
  'sulfur/schema/value/boolean'
], function (
    $shared,
    $enumerationFacet,
    $patternFacet,
    $_simpleType,
    $booleanType,
    $booleanValue
) {

  'use strict';

  var expect = $shared.expect;

  describe('sulfur/schema/type/boolean', function () {

    it("should be derived from sulfur/schema/type/_simple", function () {
      expect($_simpleType).to.be.prototypeOf($booleanType);
    });

    describe('.getLegalFacets()', function () {

      it("should include sulfur/schema/facet/enumeration", function () {
        expect($booleanType.getLegalFacets()).to.include($enumerationFacet);
      });

      it("should include sulfur/schema/facet/pattern", function () {
        expect($booleanType.getLegalFacets()).to.include($patternFacet);
      });

    });

    describe('.getValueType()', function () {

      it("should be sulfur/schema/value/boolean", function () {
        expect($booleanType.getValueType()).to.equal($booleanValue);
      });

    });

  });

});
