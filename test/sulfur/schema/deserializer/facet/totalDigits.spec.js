/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/deserializer/facet',
  'sulfur/schema/deserializer/facet/totalDigits',
  'sulfur/schema/facet/totalDigits',
  'sulfur/schema/value/simple/integer'
], function (
    shared,
    FacetResolver,
    TotalDigitsFacetResolver,
    TotalDigitsFacet,
    IntegerValue
) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/deserializer/facet/totalDigits', function () {

    it("should be a sulfur/schema/deserializer/facet", function () {
      expect(FacetResolver.prototype).to.be.prototypeOf(TotalDigitsFacetResolver);
    });

    describe('.facet', function () {

      it("should return sulfur/schema/facet/totalDigits", function () {
        expect(TotalDigitsFacetResolver.facet).to.equal(TotalDigitsFacet);
      });

    });

    describe('.reduce', function () {

      it("should return the numerically smallest value", function () {
        var values = '3 1 2'.split(' ').map(IntegerValue.parse.bind(IntegerValue));
        var value = TotalDigitsFacetResolver.reduce(values);
        expect(value).to.equal(values[1]);
      });

    });

  });

});
