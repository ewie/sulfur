/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, describe, it */

define([
  'shared',
  'sulfur/schema/facet/pattern',
  'sulfur/schema/deserializer/facet/pattern',
  'sulfur/schema/pattern'
], function (shared, PatternFacet, PatternFacetDeserializer, Pattern) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;

  describe('sulfur/schema/deserializer/facet/pattern', function () {

    describe('.getFacet()', function () {

      it("should return sulfur/schema/facet/pattern", function () {
        expect(PatternFacetDeserializer.getFacet()).to.equal(PatternFacet);
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

      it("should pass the given string to sulfur/schema/pattern.create()", function () {
        var spy = sandbox.stub(Pattern, 'create').returns({});
        var s = 'foo';
        var value = PatternFacetDeserializer.parseValue(s);
        expect(spy)
          .to.be.calledWith(s)
          .to.have.returned(sinon.match.same(value));
      });

    });

    describe('.createFacet()', function () {

      it("should return a sulfur/schema/facet/pattern with the given values", function () {
        var values = [ Pattern.create('') ];
        expect(PatternFacetDeserializer.createFacet(values))
          .to.eql(PatternFacet.create(values));
      });

    });

  });

});
