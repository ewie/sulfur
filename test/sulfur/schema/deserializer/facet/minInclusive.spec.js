/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/facet/minInclusive',
  'sulfur/schema/deserializer/facet/minInclusive'
], function (shared, MinInclusiveFacet, MinInclusiveFacetDeserializer) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;

  describe('sulfur/schema/deserializer/facet/minInclusive', function () {

    describe('.facet', function () {

      it("should return sulfur/schema/facet/minInclusive", function () {
        expect(MinInclusiveFacetDeserializer.facet).to.equal(MinInclusiveFacet);
      });

    });

    describe('.parseValue()', function () {

      it("should pass the given string to .parse() on the given object", function () {
        var obj = { parse: sinon.stub().returns({}) };
        var s = '...';
        var value = MinInclusiveFacetDeserializer.parseValue(s, obj);
        expect(obj.parse)
          .to.be.calledWith(s)
          .to.have.returned(sinon.match.same(value));
      });

    });

    describe('.createFacet()', function () {

      function value(n) {
        return {
          n: n,
          cmp: function (other) {
            return this.n - other.n;
          }
        };
      }

      it("should return a sulfur/schema/facet/minInclusive using the largest value", function () {
        var values = [ value(2), value(3), value(1) ];
        expect(MinInclusiveFacetDeserializer.createFacet(values))
          .to.eql(MinInclusiveFacet.create(values[1]));
      });

    });

  });

});
