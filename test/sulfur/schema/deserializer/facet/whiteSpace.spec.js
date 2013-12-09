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
  'sulfur/schema/deserializer/facet/whiteSpace',
  'sulfur/schema/facet/whiteSpace',
  'sulfur/schema/value/simple/whiteSpace'
], function (
    shared,
    FacetResolver,
    WhiteSpaceFacetResolver,
    WhiteSpaceFacet,
    WhiteSpaceValue
) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/deserializer/facet/whiteSpace', function () {

    it("should be a sulfur/schema/deserializer/facet", function () {
      expect(FacetResolver.prototype).to.be.prototypeOf(WhiteSpaceFacetResolver);
    });

    describe('.facet', function () {

      it("should return sulfur/schema/facet/whiteSpace", function () {
        expect(WhiteSpaceFacetResolver.facet).to.equal(WhiteSpaceFacet);
      });

    });

    describe('.reduce', function () {

      it("should return the first value", function () {
        var values = [ WhiteSpaceValue.create('collapse') ];
        var value = WhiteSpaceFacetResolver.reduce(values);
        expect(value).to.equal(values[0]);
      });

    });

  });

});
