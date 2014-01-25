/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/ui/publisher',
  'sulfur/ui/view/access/link',
  'sulfur/ui/view/access/text'
], function (shared, Publisher, LinkAccess, TextAccess) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/ui/access/link', function () {

    it("should be a sulfur/ui/view/access/text", function () {
      expect(TextAccess).to.be.prototypeOf(LinkAccess);
    });

    describe('#url', function () {

      it("should return the element's @href value", function () {
        var element = { href: {} };
        var access = LinkAccess.create(element);
        expect(access.url).to.equal(element.href);
      });

    });

    describe('#url=', function () {

      it("should set the element's @href value", function () {
        var element = { href: '' };
        var access = LinkAccess.create(element);
        var v = {};
        access.url = v;
        expect(access.url).to.equal(v);
      });

    });

  });

});
