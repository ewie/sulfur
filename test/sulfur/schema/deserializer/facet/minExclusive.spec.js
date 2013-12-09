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
  'sulfur/schema/deserializer/facet/minExclusive',
  'sulfur/schema/facet/minExclusive',
  'sulfur/schema/value/simple/integer'
], function (
    shared,
    FacetResolver,
    MinExclusiveFacetResolver,
    MinExclusiveFacet,
    IntegerValue
) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/deserializer/facet/minExclusive', function () {

    it("should be a sulfur/schema/deserializer/facet", function () {
      expect(FacetResolver.prototype).to.be.prototypeOf(MinExclusiveFacetResolver);
    });

    describe('.facet', function () {

      it("should return sulfur/schema/facet/minExclusive", function () {
        expect(MinExclusiveFacetResolver.facet).to.equal(MinExclusiveFacet);
      });

    });

    describe('.reduce', function () {

      it("should return the numerically largest value", function () {
        var values = '2 3 1'.split(' ').map(IntegerValue.parse.bind(IntegerValue));
        var value = MinExclusiveFacetResolver.reduce(values);
        expect(value).to.equal(values[1]);
      });

    });

  });

});
