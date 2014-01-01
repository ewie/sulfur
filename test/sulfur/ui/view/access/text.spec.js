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
  'sulfur/ui/view/access/text'
], function (shared, Publisher, TextAccess) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/ui/access/text', function () {

    describe('#text', function () {

      it("should return the element's text content", function () {
        var element = { textContent: {} };
        var access = TextAccess.create(element);
        var v = access.text;
        expect(v).to.equal(element.textContent);
      });

    });

    describe('#text=', function () {

      it("should set the element's text content", function () {
        var element = { textContent: '' };
        var access = TextAccess.create(element);
        var v = {};
        access.text = v;
        expect(access.text).to.equal(v);
      });

    });

  });

});
