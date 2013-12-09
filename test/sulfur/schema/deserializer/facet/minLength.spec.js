/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/deserializer/facet',
  'sulfur/schema/deserializer/facet/minLength',
  'sulfur/schema/facet/minLength',
  'sulfur/schema/value/simple/integer'
], function (
    shared,
    FacetResolver,
    MinLengthFacetResolver,
    MinLengthFacet,
    IntegerValue
) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/deserializer/facet/minLength', function () {

    it("should be a sulfur/schema/deserializer/facet", function () {
      expect(FacetResolver.prototype).to.be.prototypeOf(MinLengthFacetResolver);
    });

    describe('.facet', function () {

      it("should return sulfur/schema/facet/minLength", function () {
        expect(MinLengthFacetResolver.facet).to.equal(MinLengthFacet);
      });

    });

    describe('.reduce', function () {

      it("should return the numerically smallest value", function () {
        var values = '1 3 2'.split(' ').map(IntegerValue.parse.bind(IntegerValue));
        var value = MinLengthFacetResolver.reduce(values);
        expect(value).to.equal(values[1]);
      });

    });

  });

});
