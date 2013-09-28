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
  'sulfur/schema/value/_simple',
  'sulfur/schema/value/fileRef',
  'sulfur/schema/value/string'
], function ($shared, $file, $_simpleValue, $fileRefValue, $stringValue) {

  'use strict';

  var expect = $shared.expect;

  describe('sulfur/schema/fileRef', function () {

    it("should be derived from sulfur/schema/value/_simple", function () {
      expect($_simpleValue).to.be.prototypeOf($fileRefValue);
    });

    describe('#initialize()', function () {

      it("should accept a sulfur/schema/string as ID", function () {
        var id = $stringValue.create();
        var fr = $fileRefValue.create(id);
        expect(fr.getIdentifier()).to.equal(id);
      });

      it("should accept an optional sulfur/schema/file", function () {
        var id = $stringValue.create();
        var file = $file.create();
        var fr = $fileRefValue.create(id, file);
        expect(fr.getFile()).to.equal(file);
      });

    });

    describe('#getIdentifier()', function () {

      it("should return the ID", function () {
        var id = $stringValue.create();
        var fr = $fileRefValue.create(id);
        expect(fr.getIdentifier()).to.equal(id);
      });

    });

    describe('#getFile()', function () {

      it("should return the file when set", function () {
        var id = $stringValue.create();
        var file = $file.create();
        var fr = $fileRefValue.create(id, file);
        expect(fr.getFile()).to.equal(file);
      });

      it("should return undefined when no file is set", function () {
        var id = $stringValue.create();
        var fr = $fileRefValue.create(id);
        expect(fr.getFile()).to.be.undefined;
      });

    });

  });

});
