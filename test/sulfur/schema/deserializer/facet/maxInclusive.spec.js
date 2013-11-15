/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/deserializer/facet/maxInclusive',
  'sulfur/schema/facet/maxInclusive'
], function (shared, MaxInclusiveFacetResolver, MaxInclusiveFacet) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;

  describe('sulfur/schema/deserializer/facet/maxInclusive', function () {

    describe('.facet', function () {

      it("should return sulfur/schema/facet/maxInclusive", function () {
        expect(MaxInclusiveFacetResolver.facet).to.equal(MaxInclusiveFacet);
      });

    });

    describe('.parseValue()', function () {

      it("should pass the given string to .parse() on the given object", function () {
        var obj = { parse: sinon.stub().returns({}) };
        var s = '...';
        var value = MaxInclusiveFacetResolver.parseValue(s, obj);
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

      it("should return a sulfur/schema/facet/maxInclusive using the smallest value", function () {
        var values = [ value(2), value(0), value(1) ];
        expect(MaxInclusiveFacetResolver.createFacet(values))
          .to.eql(MaxInclusiveFacet.create(values[1]));
      });

    });

  });

});
