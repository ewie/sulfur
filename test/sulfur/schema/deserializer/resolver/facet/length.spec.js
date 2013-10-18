/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/facet/length',
  'sulfur/schema/deserializer/resolver/facet/length'
], function ($shared, $lengthFacet, $lengthFacetResolver) {

  'use strict';

  var expect = $shared.expect;

  describe('sulfur/schema/deserializer/resolver/facet/length', function () {

    describe('.getFacet()', function () {

      it("should return sulfur/schema/facet/length", function () {
        expect($lengthFacetResolver.getFacet()).to.equal($lengthFacet);
      });

    });

    describe('.parseValue()', function () {

      it("should parse a decimal integer", function () {
        expect($lengthFacetResolver.parseValue('123')).to.equal(123);
      });

    });

    describe('.createFacet()', function () {

      it("should return a sulfur/schema/facet/length using the first value of the array", function () {
        expect($lengthFacetResolver.createFacet([ 1 ]))
          .to.eql($lengthFacet.create(1));
      });

    });

  });

});
