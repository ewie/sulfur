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
  'sulfur/schema/deserializer/facet/mediaType',
  'sulfur/schema/facet/mediaType'
], function (
    shared,
    FacetResolver,
    MediaTypeFacetResolver,
    MediaTypeFacet
) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/deserializer/facet/mediaType', function () {

    it("should be a sulfur/schema/deserializer/facet", function () {
      expect(FacetResolver.prototype).to.be.prototypeOf(MediaTypeFacetResolver);
    });

    describe('.facet', function () {

      it("should return sulfur/schema/facet/mediaType", function () {
        expect(MediaTypeFacetResolver.facet).to.equal(MediaTypeFacet);
      });

    });

    describe('.reduce', function () {

      it("should return all values", function () {
        var values = [];
        expect(MediaTypeFacetResolver.reduce(values)).to.equal(values);
      });

    });

  });

});
