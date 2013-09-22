/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, describe, it */

define([
  'shared',
  'sulfur/schema/facet/_any'
], function ($shared, $_anyFacet) {

  'use strict';

  var expect = $shared.expect;
  var sinon = $shared.sinon;

  describe('sulfur/schema/facet/_any', function () {

    var $derivedFacet;
    var facet;

    beforeEach(function () {
      $derivedFacet = $_anyFacet.clone({
        getName: function () { return 'foo'; },
        getNamespace: function () { return 'urn:void'; }
      });
      facet = $derivedFacet.create();
    });

    describe('#initialize()', function () {

      it("should initialize with a value", function () {
        var value = {};
        var facet = $_anyFacet.create(value);
        expect(facet.getValue()).to.equal(value);
      });

    });

    describe('#getName()', function () {

      it("should return the value of .getName()", function () {
        var spy = sinon.spy($derivedFacet, 'getName');
        var name = facet.getName();
        expect(spy)
          .to.be.calledOn($derivedFacet)
          .to.have.returned(name);
      });

    });

    describe('#getNamespace()', function () {

      it("should return the value of .getNamespace()", function () {
        var spy = sinon.spy($derivedFacet, 'getNamespace');
        var namespace = facet.getNamespace();
        expect(spy)
          .to.be.calledOn($derivedFacet)
          .to.have.returned(namespace);
      });

    });

    describe('#getValue()', function () {

      it("should return the facet value", function () {
        var value = {};
        var facet = $_anyFacet.create(value);
        expect(facet.getValue()).to.equal(value);
      });

    });

  });

});
