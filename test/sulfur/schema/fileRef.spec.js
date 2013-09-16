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
  'sulfur/schema/fileRef',
  'sulfur/schema/string'
], function ($shared, $file, $fileRef, $string) {

  'use strict';

  var expect = $shared.expect;

  describe('sulfur/schema/fileRef', function () {

    describe('#initialize()', function () {

      it("should accept a sulfur/schema/string as ID", function () {
        var id = $string.create();
        var fr = $fileRef.create(id);
        expect(fr.getIdentifier()).to.equal(id);
      });

      it("should accept an optional sulfur/schema/file", function () {
        var id = $string.create();
        var file = $file.create();
        var fr = $fileRef.create(id, file);
        expect(fr.getFile()).to.equal(file);
      });

    });

    describe('#getIdentifier()', function () {

      it("should return the ID", function () {
        var id = $string.create();
        var fr = $fileRef.create(id);
        expect(fr.getIdentifier()).to.equal(id);
      });

    });

    describe('#getFile()', function () {

      it("should return the file when set", function () {
        var id = $string.create();
        var file = $file.create();
        var fr = $fileRef.create(id, file);
        expect(fr.getFile()).to.equal(file);
      });

      it("should return undefined when no file is set", function () {
        var id = $string.create();
        var fr = $fileRef.create(id);
        expect(fr.getFile()).to.be.undefined;
      });

    });

  });

});
