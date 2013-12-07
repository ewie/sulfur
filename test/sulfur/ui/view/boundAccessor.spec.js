/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/ui/view/boundAccessor'
], function (shared, BoundAccessor) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/ui/view/boundAccessor', function () {

    describe('#name', function () {

      it("should return the name", function () {
        var name = 'foo';
        var boundAccessor = BoundAccessor.create(name);
        expect(boundAccessor.name).to.equal(name);
      });

    });

    describe('#access', function () {

      it("should return the access", function () {
        var access = {};
        var boundAccessor = BoundAccessor.create('', access);
        expect(boundAccessor.access).to.equal(access);
      });

    });

  });

});
