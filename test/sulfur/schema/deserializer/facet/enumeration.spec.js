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
  'sulfur/schema/deserializer/facet/enumeration',
  'sulfur/schema/facet/enumeration'
], function (shared, FacetResolver, EnumerationFacetResolver, EnumerationFacet) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/deserializer/facet/enumeration', function () {

    it("should be a sulfur/schema/deserializer/facet", function () {
      expect(FacetResolver.prototype).to.be.prototypeOf(EnumerationFacetResolver);
    });

    describe('.facet', function () {

      it("should return sulfur/schema/facet/enumeration", function () {
        expect(EnumerationFacetResolver.facet).to.equal(EnumerationFacet);
      });

    });

    describe('.reduce', function () {

      it("should return the values", function () {
        var values = [];
        expect(EnumerationFacetResolver.reduce(values)).to.equal(values);
      });

    });

  });

});
