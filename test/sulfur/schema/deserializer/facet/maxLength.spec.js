/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/deserializer/facet/maxLength',
  'sulfur/schema/facet/maxLength'
], function (shared, MaxLengthFacetResolver, MaxLengthFacet) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/deserializer/facet/maxLength', function () {

    describe('.facet', function () {

      it("should return sulfur/schema/facet/maxLength", function () {
        expect(MaxLengthFacetResolver.facet).to.equal(MaxLengthFacet);
      });

    });

    describe('.parseValue()', function () {

      it("should parse a decimal integer", function () {
        expect(MaxLengthFacetResolver.parseValue('123')).to.equal(123);
      });

    });

    describe('.createFacet()', function () {

      it("should return a sulfur/schema/facet/maxLength using the smallest value", function () {
        expect(MaxLengthFacetResolver.createFacet([ 1, 0, 2 ]))
          .to.eql(MaxLengthFacet.create(0));
      });

    });

  });

});
