/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/facet/totalDigits',
  'sulfur/schema/deserializer/resolver/facet/totalDigits'
], function ($shared, $totalDigitsFacet, $totalDigitsFacetResolver) {

  'use strict';

  var expect = $shared.expect;

  describe('sulfur/schema/deserializer/resolver/facet/totalDigits', function () {

    describe('.getFacet()', function () {

      it("should return sulfur/schema/facet/totalDigits", function () {
        expect($totalDigitsFacetResolver.getFacet()).to.equal($totalDigitsFacet);
      });

    });

    describe('.parseValue()', function () {

      it("should parse a decimal integer", function () {
        expect($totalDigitsFacetResolver.parseValue('123')).to.equal(123);
      });

    });

    describe('.createFacet()', function () {

      it("should return a sulfur/schema/facet/totalDigits using the smallest value", function () {
        expect($totalDigitsFacetResolver.createFacet([ 3, 1, 2 ]))
          .to.eql($totalDigitsFacet.create(1));
      });

    });

  });

});
