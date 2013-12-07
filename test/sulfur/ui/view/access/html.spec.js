/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/ui/view/access/html'
], function (shared, HtmlAccess) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/ui/access/html', function () {

    describe('#html', function () {

      it("should return the element's HTML content", function () {
        var element = { innerHTML: {} };
        var access = HtmlAccess.create(element);
        expect(access.html).to.equal(element.innerHTML);
      });

    });

    describe('#html=', function () {

      it("should set the element's HTML content", function () {
        var element = { innerHTML: null };
        var access = HtmlAccess.create(element);
        var v = {};
        access.html = v;
        expect(access.html).to.equal(v);
      });

    });

  });

});
