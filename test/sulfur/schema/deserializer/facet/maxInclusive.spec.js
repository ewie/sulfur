/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/deserializer/facet',
  'sulfur/schema/deserializer/facet/maxInclusive',
  'sulfur/schema/facet/maxInclusive',
  'sulfur/schema/value/simple/integer'
], function (
    shared,
    FacetResolver,
    MaxInclusiveFacetResolver,
    MaxInclusiveFacet,
    IntegerValue
) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/deserializer/facet/maxInclusive', function () {

    it("should be a sulfur/schema/deserializer/facet", function () {
      expect(FacetResolver.prototype).to.be.prototypeOf(MaxInclusiveFacetResolver);
    });

    describe('.facet', function () {

      it("should return sulfur/schema/facet/maxInclusive", function () {
        expect(MaxInclusiveFacetResolver.facet).to.equal(MaxInclusiveFacet);
      });

    });

    describe('.reduce', function () {

      it("should return the numerically smallest value", function () {
        var values = '2 0 1'.split(' ').map(IntegerValue.parse.bind(IntegerValue));
        var value = MaxInclusiveFacetResolver.reduce(values);
        expect(value).to.equal(values[1]);
      });

    });

  });

});
