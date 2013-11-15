/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/deserializer/facet/totalDigits',
  'sulfur/schema/facet/totalDigits'
], function (shared, TotalDigitsFacetResolver, TotalDigitsFacet) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/deserializer/facet/totalDigits', function () {

    describe('.facet', function () {

      it("should return sulfur/schema/facet/totalDigits", function () {
        expect(TotalDigitsFacetResolver.facet).to.equal(TotalDigitsFacet);
      });

    });

    describe('.parseValue()', function () {

      it("should parse a decimal integer", function () {
        expect(TotalDigitsFacetResolver.parseValue('123')).to.equal(123);
      });

    });

    describe('.createFacet()', function () {

      it("should return a sulfur/schema/facet/totalDigits using the smallest value", function () {
        expect(TotalDigitsFacetResolver.createFacet([ 3, 1, 2 ]))
          .to.eql(TotalDigitsFacet.create(1));
      });

    });

  });

});
