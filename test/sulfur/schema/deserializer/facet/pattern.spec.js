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
  'sulfur/schema/deserializer/facet/pattern',
  'sulfur/schema/facet/pattern'
], function (shared, FacetResolver, PatternFacetResolver, PatternFacet) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/deserializer/facet/pattern', function () {

    it("should be a sulfur/schema/deserializer/facet", function () {
      expect(FacetResolver.prototype).to.be.prototypeOf(PatternFacetResolver);
    });

    describe('.facet', function () {

      it("should return sulfur/schema/facet/pattern", function () {
        expect(PatternFacetResolver.facet).to.equal(PatternFacet);
      });

    });

    describe('.reduce', function () {

      it("should return the values", function () {
        var values = [];
        expect(PatternFacetResolver.reduce(values)).to.equal(values);
      });

    });

  });

});
