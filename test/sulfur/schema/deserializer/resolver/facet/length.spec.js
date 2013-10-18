/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/facet/length',
  'sulfur/schema/deserializer/resolver/facet/length'
], function (shared, LengthFacet, LengthFacetResolver) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/deserializer/resolver/facet/length', function () {

    describe('.getFacet()', function () {

      it("should return sulfur/schema/facet/length", function () {
        expect(LengthFacetResolver.getFacet()).to.equal(LengthFacet);
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
