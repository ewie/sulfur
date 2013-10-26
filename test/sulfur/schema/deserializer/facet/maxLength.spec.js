/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/facet/maxLength',
  'sulfur/schema/deserializer/facet/maxLength'
], function (shared, MaxLengthFacet, MaxLengthFacetDeserializer) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/deserializer/facet/maxLength', function () {

    describe('.facet', function () {

      it("should return sulfur/schema/facet/maxLength", function () {
        expect(MaxLengthFacetDeserializer.facet).to.equal(MaxLengthFacet);
      });

    });

    describe('.parseValue()', function () {

      it("should parse a decimal integer", function () {
        expect(MaxLengthFacetDeserializer.parseValue('123')).to.equal(123);
      });

    });

    describe('.createFacet()', function () {

      it("should return a sulfur/schema/facet/maxLength using the smallest value", function () {
        expect(MaxLengthFacetDeserializer.createFacet([ 1, 0, 2 ]))
          .to.eql(MaxLengthFacet.create(0));
      });

    });

  });

});
