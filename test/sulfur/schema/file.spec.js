/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/file',
  'sulfur/schema/mediaType'
], function (shared, File, MediaType) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/file', function () {

    describe('#initialize()', function () {

      it("should accept a Blob", function () {
        var blob = new Blob([], { type: 'image/jpeg' });
        var f = File.create(blob);
        expect(f.mediaType).to.eql(MediaType.create('image', 'jpeg'));
      });

    });

    describe('#mediaType', function () {

      it("should return the media type", function () {
        var blob = new Blob([], { type: 'text/plain' });
        var f = File.create(blob);
        expect(f.mediaType).to.eql(MediaType.create('text', 'plain'));
      });

    });

  });

});
