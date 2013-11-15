/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/deserializer/facet/minLength',
  'sulfur/schema/facet/minLength'
], function (shared, MinLengthFacetResolver, MinLengthFacet) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/deserializer/facet/minLength', function () {

    describe('.facet', function () {

      it("should return sulfur/schema/facet/minLength", function () {
        expect(MinLengthFacetResolver.facet).to.equal(MinLengthFacet);
      });

    });

    describe('.parseValue()', function () {

      it("should parse a decimal integer", function () {
        expect(MinLengthFacetResolver.parseValue('123')).to.equal(123);
      });

    });

    describe('.createFacet()', function () {

      it("should return a sulfur/schema/facet/minLength using the largest value", function () {
        expect(MinLengthFacetResolver.createFacet([ 1, 3, 2 ]))
          .to.eql(MinLengthFacet.create(3));
      });

    });

  });

});
