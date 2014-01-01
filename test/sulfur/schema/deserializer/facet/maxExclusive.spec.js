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
  'sulfur/schema/deserializer/facet/maxExclusive',
  'sulfur/schema/facet/maxExclusive',
  'sulfur/schema/value/simple/integer'
], function (
    shared,
    FacetResolver,
    MaxExclusiveFacetResolver,
    MaxExclusiveFacet,
    IntegerValue
) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/deserializer/facet/maxExclusive', function () {

    it("should be a sulfur/schema/deserializer/facet", function () {
      expect(FacetResolver.prototype).to.be.prototypeOf(MaxExclusiveFacetResolver);
    });

    describe('.facet', function () {

      it("should return sulfur/schema/facet/maxExclusive", function () {
        expect(MaxExclusiveFacetResolver.facet).to.equal(MaxExclusiveFacet);
      });

    });

    describe('.reduce', function () {

      it("should return the numerically smallest value", function () {
        var values = '2 0 1'.split(' ').map(IntegerValue.parse.bind(IntegerValue));
        var value = MaxExclusiveFacetResolver.reduce(values);
        expect(value).to.equal(values[1]);
      });

    });

  });

});
