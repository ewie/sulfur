/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/facet/_any',
  'sulfur/schema/facet/_standard'
], function ($shared, $_anyFacet, $_standardFacet) {

  'use strict';

  var expect = $shared.expect;

  describe('sulfur/schema/facet/_standard', function () {

    it("should be derived from sulfur/schema/facet/_any", function () {
      expect($_anyFacet).to.be.prototypeOf($_standardFacet);
    });

    describe('.getNamespace()', function () {

      it("should return 'http://www.w3.org/2001/XMLSchema'", function () {
        expect($_standardFacet.getNamespace()).to.equal('http://www.w3.org/2001/XMLSchema');
      });

    });

  });

});
