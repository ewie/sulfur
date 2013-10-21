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
  'sulfur/schema/deserializer/facet/mediaType',
  'sulfur/schema/mediaType'
], function (shared, MediaTypeFacet, MediaTypeFacetDeserializer, MediaType) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;

  describe('sulfur/schema/deserializer/facet/mediaType', function () {

    describe('.getFacet()', function () {

      it("should return sulfur/schema/facet/mediaType", function () {
        expect(MediaTypeFacetDeserializer.getFacet()).to.equal(MediaTypeFacet);
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
        var spy = sandbox.stub(MediaType, 'parse').returns({});
        var s = 'foo';
        var value = MediaTypeFacetDeserializer.parseValue(s);
        expect(spy)
          .to.be.calledWith(s)
          .to.have.returned(sinon.match.same(value));
      });

    });

    describe('.createFacet()', function () {

      it("should return a sulfur/schema/facet/mediaType with the given values", function () {
        var values = [ MediaType.create('text', 'plain') ];
        expect(MediaTypeFacetDeserializer.createFacet(values))
          .to.eql(MediaTypeFacet.create(values));
      });

    });

  });

});
