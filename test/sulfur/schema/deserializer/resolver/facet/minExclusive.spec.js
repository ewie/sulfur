/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/facet/minExclusive',
  'sulfur/schema/deserializer/resolver/facet/minExclusive'
], function (shared, MinExclusiveFacet, MinExclusiveFacetResolver) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;

  describe('sulfur/schema/deserializer/resolver/facet/minExclusive', function () {

    describe('.getFacet()', function () {

      it("should return sulfur/schema/facet/minExclusive", function () {
        expect(MinExclusiveFacetResolver.getFacet()).to.equal(MinExclusiveFacet);
      });

    });

    describe('.parseValue()', function () {

      it("should pass the given string to .parse() on the given object", function () {
        var obj = { parse: sinon.stub().returns({}) };
        var s = '...';
        var value = MinExclusiveFacetResolver.parseValue(s, obj);
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

      it("should return a sulfur/schema/facet/minExclusive using the largest value", function () {
        var values = [ value(2), value(3), value(1) ];
        expect(MinExclusiveFacetResolver.createFacet(values))
          .to.eql(MinExclusiveFacet.create(values[1]));
      });

    });

  });

});
