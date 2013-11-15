/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/deserializer/facet/length',
  'sulfur/schema/facet/length'
], function (shared, LengthFacetResolver, LengthFacet) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/deserializer/facet/length', function () {

    describe('.facet', function () {

      it("should return sulfur/schema/facet/length", function () {
        expect(LengthFacetResolver.facet).to.equal(LengthFacet);
      });

    });

    describe('.parseValue()', function () {

      it("should parse a decimal integer", function () {
        expect(LengthFacetResolver.parseValue('123')).to.equal(123);
      });

    });

    describe('.createFacet()', function () {

      it("should return a sulfur/schema/facet/length using the first value of the array", function () {
        expect(LengthFacetResolver.createFacet([ 1 ]))
          .to.eql(LengthFacet.create(1));
      });

    });

  });

});
