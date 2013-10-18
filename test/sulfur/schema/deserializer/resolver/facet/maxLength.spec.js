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
  'sulfur/schema/deserializer/resolver/facet/maxLength'
], function ($shared, $maxLengthFacet, $maxLengthFacetResolver) {

  'use strict';

  var expect = $shared.expect;

  describe('sulfur/schema/deserializer/resolver/facet/maxLength', function () {

    describe('.getFacet()', function () {

      it("should return sulfur/schema/facet/maxLength", function () {
        expect($maxLengthFacetResolver.getFacet()).to.equal($maxLengthFacet);
      });

    });

    describe('.parseValue()', function () {

      it("should parse a decimal integer", function () {
        expect($maxLengthFacetResolver.parseValue('123')).to.equal(123);
      });

    });

    describe('.createFacet()', function () {

      it("should return a sulfur/schema/facet/maxLength using the smallest value", function () {
        expect($maxLengthFacetResolver.createFacet([ 1, 0, 2 ]))
          .to.eql($maxLengthFacet.create(0));
      });

    });

  });

});
