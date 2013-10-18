/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/facet/maxExclusive',
  'sulfur/schema/deserializer/resolver/facet/maxExclusive'
], function ($shared, $maxExclusiveFacet, $maxExclusiveFacetResolver) {

  'use strict';

  var expect = $shared.expect;
  var sinon = $shared.sinon;

  describe('sulfur/schema/deserializer/resolver/facet/maxExclusive', function () {

    describe('.getFacet()', function () {

      it("should return sulfur/schema/facet/maxExclusive", function () {
        expect($maxExclusiveFacetResolver.getFacet()).to.equal($maxExclusiveFacet);
      });

    });

    describe('.parseValue()', function () {

      it("should pass the given string to .parse() on the given object", function () {
        var obj = { parse: sinon.stub().returns({}) };
        var s = '...';
        var value = $maxExclusiveFacetResolver.parseValue(s, obj);
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

      it("should return a sulfur/schema/facet/maxExclusive using the smallest value", function () {
        var values = [ value(2), value(0), value(1) ];
        expect($maxExclusiveFacetResolver.createFacet(values))
          .to.eql($maxExclusiveFacet.create(values[1]));
      });

    });

  });

});
