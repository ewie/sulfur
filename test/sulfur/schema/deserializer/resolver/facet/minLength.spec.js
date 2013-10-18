/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/facet/minLength',
  'sulfur/schema/deserializer/resolver/facet/minLength'
], function ($shared, $minLengthFacet, $minLengthFacetResolver) {

  'use strict';

  var expect = $shared.expect;

  describe('sulfur/schema/deserializer/resolver/facet/minLength', function () {

    describe('.getFacet()', function () {

      it("should return sulfur/schema/facet/minLength", function () {
        expect($minLengthFacetResolver.getFacet()).to.equal($minLengthFacet);
      });

    });

    describe('.parseValue()', function () {

      it("should parse a decimal integer", function () {
        expect($minLengthFacetResolver.parseValue('123')).to.equal(123);
      });

    });

    describe('.createFacet()', function () {

      it("should return a sulfur/schema/facet/minLength using the largest value", function () {
        expect($minLengthFacetResolver.createFacet([ 1, 3, 2 ]))
          .to.eql($minLengthFacet.create(3));
      });

    });

  });

});
