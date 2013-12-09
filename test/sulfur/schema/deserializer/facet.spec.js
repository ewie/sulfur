/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/deserializer/facet'
], function (shared, FacetResolver) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var returns = shared.returns;

  describe('sulfur/schema/deserializer/facet', function () {

    describe('#facet', function () {

      it("should return the facet", function () {
        var facet = {};
        var facetResolver = FacetResolver.create(facet);
        expect(facetResolver.facet).to.equal(facet);
      });

    });

    describe('#reduce', function () {

      it("should return the reduce function", function () {
        var reduce = function () {};
        var facetResolver = FacetResolver.create(null, reduce);
        expect(facetResolver.reduce).to.equal(reduce);
      });

    });

    describe('#parseValue()', function () {

      it("should parse the string using the facet's value type", function () {
        var valueType = { parse: function () {} };
        var facet = { getValueType: returns(valueType) };
        var facetResolver = FacetResolver.create(facet);
        var spy = sinon.spy(facet, 'getValueType');
        var parseSpy = sinon.spy(valueType, 'parse');
        var s = {};
        var t = {};
        var v = facetResolver.parseValue(s, t);
        expect(spy).to.be.calledWith(sinon.match.same(t));
        expect(parseSpy)
          .to.be.calledWith(sinon.match.same(s))
          .to.have.returned(sinon.match.same(v));
      });

    });

    describe('#createFacet()', function () {

      it("should return an instance of the facet with the reduced value", function () {
        var reducedValue = {};
        var reduce = sinon.stub().returns(reducedValue);
        var facet = { create: function () {} };
        var facetResolver = FacetResolver.create(facet, reduce);
        var createSpy = sinon.spy(facet, 'create');
        var values = {};
        var f = facetResolver.createFacet(values);
        expect(reduce).to.be.calledWith(sinon.match.same(values));
        expect(createSpy)
          .to.be.calledWith(sinon.match.same(reducedValue))
          .to.have.returned(sinon.match.same(f));
      });

    });

  });

});
