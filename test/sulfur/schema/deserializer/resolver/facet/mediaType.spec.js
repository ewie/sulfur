/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, describe, it */

define([
  'shared',
  'sulfur/schema/facet/mediaType',
  'sulfur/schema/deserializer/resolver/facet/mediaType',
  'sulfur/schema/mediaType'
], function ($shared, $mediaTypeFacet, $mediaTypeFacetResolver, $mediaType) {

  'use strict';

  var expect = $shared.expect;
  var sinon = $shared.sinon;

  describe('sulfur/schema/deserializer/resolver/facet/mediaType', function () {

    describe('.getFacet()', function () {

      it("should return sulfur/schema/facet/mediaType", function () {
        expect($mediaTypeFacetResolver.getFacet()).to.equal($mediaTypeFacet);
      });

    });

    describe('.parseValue()', function () {

      var sandbox;

      beforeEach(function () {
        sandbox = sinon.sandbox.create();
      });

      afterEach(function () {
        sandbox.restore();
      });

      it("should pass the given string to sulfur/schema/mediaType.parse()", function () {
        var spy = sandbox.stub($mediaType, 'parse').returns({});
        var s = 'foo';
        var value = $mediaTypeFacetResolver.parseValue(s);
        expect(spy)
          .to.be.calledWith(s)
          .to.have.returned(sinon.match.same(value));
      });

    });

    describe('.createFacet()', function () {

      it("should return a sulfur/schema/facet/mediaType with the given values", function () {
        var values = [ $mediaType.create('text', 'plain') ];
        expect($mediaTypeFacetResolver.createFacet(values))
          .to.eql($mediaTypeFacet.create(values));
      });

    });

  });

});
