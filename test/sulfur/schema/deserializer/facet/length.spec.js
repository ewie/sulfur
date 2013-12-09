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
  'sulfur/schema/deserializer/facet/length',
  'sulfur/schema/facet/length'
], function (shared, FacetResolver, LengthFacetResolver, LengthFacet) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/deserializer/facet/length', function () {

    it("should be a sulfur/schema/deserializer/facet", function () {
      expect(FacetResolver.prototype).to.be.prototypeOf(LengthFacetResolver);
    });

    describe('.facet', function () {

      it("should return sulfur/schema/facet/length", function () {
        expect(LengthFacetResolver.facet).to.equal(LengthFacet);
      });

    });

    describe('.reduce', function () {

      it("should return the first value", function () {
        var values = [ {} ];
        expect(LengthFacetResolver.reduce(values)).to.equal(values[0]);
      });

    });

  });

});
