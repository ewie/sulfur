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
  'sulfur/schema/deserializer/facet/minInclusive',
  'sulfur/schema/facet/minInclusive',
  'sulfur/schema/value/simple/integer'
], function (
    shared,
    FacetResolver,
    MinInclusiveFacetResolver,
    MinInclusiveFacet,
    IntegerValue
) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/deserializer/facet/minInclusive', function () {

    it("should be a sulfur/schema/deserializer/facet", function () {
      expect(FacetResolver.prototype).to.be.prototypeOf(MinInclusiveFacetResolver);
    });

    describe('.facet', function () {

      it("should return sulfur/schema/facet/minInclusive", function () {
        expect(MinInclusiveFacetResolver.facet).to.equal(MinInclusiveFacet);
      });

    });

    describe('.reduce', function () {

      it("should return the numerically largest value", function () {
        var values = '2 3 1'.split(' ').map(IntegerValue.parse.bind(IntegerValue));
        var value = MinInclusiveFacetResolver.reduce(values);
        expect(value).to.equal(values[1]);
      });

    });

  });

});
