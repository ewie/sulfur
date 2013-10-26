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
  'sulfur/schema/deserializer/facet/totalDigits'
], function (shared, TotalDigitsFacet, TotalDigitsFacetDeserializer) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/deserializer/facet/totalDigits', function () {

    describe('.facet', function () {

      it("should return sulfur/schema/facet/totalDigits", function () {
        expect(TotalDigitsFacetDeserializer.facet).to.equal(TotalDigitsFacet);
      });

    });

    describe('.parseValue()', function () {

      it("should parse a decimal integer", function () {
        expect(TotalDigitsFacetDeserializer.parseValue('123')).to.equal(123);
      });

    });

    describe('.createFacet()', function () {

      it("should return a sulfur/schema/facet/totalDigits using the smallest value", function () {
        expect(TotalDigitsFacetDeserializer.createFacet([ 3, 1, 2 ]))
          .to.eql(TotalDigitsFacet.create(1));
      });

    });

  });

});
