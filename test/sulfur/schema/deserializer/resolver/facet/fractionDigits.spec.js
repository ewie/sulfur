/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/facet/fractionDigits',
  'sulfur/schema/deserializer/resolver/facet/fractionDigits'
], function ($shared, $fractionDigitsFacet, $fractionDigitsFacetResolver) {

  'use strict';

  var expect = $shared.expect;

  describe('sulfur/schema/deserializer/resolver/facet/fractionDigits', function () {

    describe('.getFacet()', function () {

      it("should return sulfur/schema/facet/fractionDigits", function () {
        expect($fractionDigitsFacetResolver.getFacet()).to.equal($fractionDigitsFacet);
      });

    });

    describe('.parseValue()', function () {

      it("should parse a decimal integer", function () {
        expect($fractionDigitsFacetResolver.parseValue('123')).to.equal(123);
      });

    });

    describe('.createFacet()', function () {

      it("should return a sulfur/schema/facet/fractionDigits using the smallest value", function () {
        expect($fractionDigitsFacetResolver.createFacet([ 1, 0, 2 ]))
          .to.eql($fractionDigitsFacet.create(0));
      });

    });

  });

});
