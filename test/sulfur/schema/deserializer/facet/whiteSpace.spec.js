/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/facet/whiteSpace',
  'sulfur/schema/deserializer/facet/whiteSpace'
], function (shared, WhiteSpaceFacet, WhiteSpaceFacetDeserializer) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/deserializer/facet/whiteSpace', function () {

    describe('.getFacet()', function () {

      it("should return sulfur/schema/facet/whiteSpace", function () {
        expect(WhiteSpaceFacetDeserializer.getFacet()).to.equal(WhiteSpaceFacet);
      });

    });

    describe('.parseValue()', function () {

      it("should return the given string", function () {
        expect(WhiteSpaceFacetDeserializer.parseValue('collapse')).to.equal('collapse');
      });

    });

    describe('.createFacet()', function () {

      it("should return a sulfur/schema/facet/whiteSpace with the first value", function () {
        expect(WhiteSpaceFacetDeserializer.createFacet([ 'collapse' ]))
          .to.eql(WhiteSpaceFacet.create('collapse'));
      });

    });

  });

});
