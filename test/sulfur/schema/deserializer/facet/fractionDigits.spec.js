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
  'sulfur/schema/deserializer/facet/fractionDigits',
  'sulfur/schema/facet/fractionDigits',
  'sulfur/schema/value/simple/integer'
], function (
    shared,
    FacetResolver,
    FractionDigitsFacetResolver,
    FractionDigitsFacet,
    IntegerValue
) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/deserializer/facet/fractionDigits', function () {

    it("should be a sulfur/schema/deserializer/facet", function () {
      expect(FacetResolver.prototype).to.be.prototypeOf(FractionDigitsFacetResolver);
    });

    describe('.facet', function () {

      it("should return sulfur/schema/facet/fractionDigits", function () {
        expect(FractionDigitsFacetResolver.facet).to.equal(FractionDigitsFacet);
      });

    });

    describe('.reduce', function () {

      it("should return the numerically smallest value", function () {
        var values = '1 0 2'.split(' ').map(IntegerValue.parse.bind(IntegerValue));
        var value = FractionDigitsFacetResolver.reduce(values);
        expect(value).to.equal(values[1]);
      });

    });

  });

});
