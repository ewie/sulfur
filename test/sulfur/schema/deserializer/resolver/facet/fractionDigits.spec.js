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
], function (shared, FractionDigitsFacet, FractionDigitsFacetResolver) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/deserializer/resolver/facet/fractionDigits', function () {

    describe('.getFacet()', function () {

      it("should return sulfur/schema/facet/fractionDigits", function () {
        expect(FractionDigitsFacetResolver.getFacet()).to.equal(FractionDigitsFacet);
      });

    });

    describe('.parseValue()', function () {

      it("should parse a decimal integer", function () {
        expect(FractionDigitsFacetResolver.parseValue('123')).to.equal(123);
      });

    });

    describe('.createFacet()', function () {

      it("should return a sulfur/schema/facet/fractionDigits using the smallest value", function () {
        expect(FractionDigitsFacetResolver.createFacet([ 1, 0, 2 ]))
          .to.eql(FractionDigitsFacet.create(0));
      });

    });

  });

});
