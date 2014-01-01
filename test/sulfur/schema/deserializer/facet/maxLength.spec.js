/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/deserializer/facet',
  'sulfur/schema/deserializer/facet/maxLength',
  'sulfur/schema/facet/maxLength',
  'sulfur/schema/value/simple/integer'
], function (
    shared,
    FacetResolver,
    MaxLengthFacetResolver,
    MaxLengthFacet,
    IntegerValue
) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/deserializer/facet/maxLength', function () {

    it("should be a sulfur/schema/deserializer/facet", function () {
      expect(FacetResolver.prototype).to.be.prototypeOf(MaxLengthFacetResolver);
    });

    describe('.facet', function () {

      it("should return sulfur/schema/facet/maxLength", function () {
        expect(MaxLengthFacetResolver.facet).to.equal(MaxLengthFacet);
      });

    });

    describe('.reduce', function () {

      it("should return the numerically smallest value", function () {
        var values = '1 0 2'.split(' ').map(IntegerValue.parse.bind(IntegerValue));
        var value = MaxLengthFacetResolver.reduce(values);
        expect(value).to.equal(values[1]);
      });

    });

  });

});
