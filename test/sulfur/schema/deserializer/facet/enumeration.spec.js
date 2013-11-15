/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/deserializer/facet/enumeration',
  'sulfur/schema/facet/enumeration'
], function (shared, EnumerationFacetResolver, EnumerationFacet) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;

  describe('sulfur/schema/deserializer/facet/enumeration', function () {

    describe('.facet', function () {

      it("should return sulfur/schema/facet/enumeration", function () {
        expect(EnumerationFacetResolver.facet).to.equal(EnumerationFacet);
      });

    });

    describe('.parseValue()', function () {

      it("should pass the given string to .parse() on the given object", function () {
        var obj = { parse: sinon.stub().returns({}) };
        var s = '...';
        var value = EnumerationFacetResolver.parseValue(s, obj);
        expect(obj.parse)
          .to.be.calledWith(s)
          .to.have.returned(sinon.match.same(value));
      });

    });

    describe('.createFacet()', function () {

      it("should return a sulfur/schema/facet/enumeration with the given values", function () {
        expect(EnumerationFacetResolver.createFacet([ 1, 2, 3 ]))
          .to.eql(EnumerationFacet.create([ 1, 2, 3 ]));
      });

    });

  });

});
